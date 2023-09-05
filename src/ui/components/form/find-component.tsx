// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AddressSelect } from '../account/select';
import { Bool } from './bool';
import { Enum } from './enum';
import { Input } from './input';
import { InputBalance } from './Input-balance';
import { InputBn } from './Input-bn';
import { InputBytes } from './Input-bytes';
import { InputHash } from './input-hash';
import { Option } from './option';
import { Struct } from './struct';
import { SubForm } from './sub-form';
import { Tuple } from './tuple';
import { Vector } from './vector';
import { VectorFixed } from './vector-fixed';
import { ArgComponentProps, Registry, TypeDef, TypeDefInfo } from 'types';

function subComponents(
  registry: Registry,
  typeDef: TypeDef,
  nestingNumber: number,
): React.ComponentType<ArgComponentProps<unknown>>[] {
  if (!typeDef.sub) {
    throw new Error('Cannot retrieve subComponent array for type definition');
  }

  return (Array.isArray(typeDef.sub) ? typeDef.sub : [typeDef.sub]).map(subTypeDef =>
    findComponent(registry, subTypeDef, nestingNumber),
  );
}

// nestingNumber counts the depth of nested components
export function findComponent(
  registry: Registry,
  type: TypeDef,
  nestingNumber = 0,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ComponentType<ArgComponentProps<any>> {
  if (type.info === TypeDefInfo.Compact) {
    return findComponent(registry, type.sub as TypeDef);
  }

  if (type.info === TypeDefInfo.Enum) {
    const components = subComponents(registry, type, nestingNumber);

    return (props: React.PropsWithChildren<ArgComponentProps<Record<string, unknown>>>) => (
      <Enum components={components} {...props} typeDef={type} />
    );
  }

  if (type.info === TypeDefInfo.Option) {
    const [component] = subComponents(registry, type, nestingNumber);

    return (props: React.PropsWithChildren<ArgComponentProps<unknown>>) => {
      return <Option component={component} {...props} typeDef={type} />;
    };
  }

  if (type.info === TypeDefInfo.Si) {
    return findComponent(
      registry,
      registry.lookup.getTypeDef(type.type as `Lookup${number}`),
      nestingNumber,
    );
  }

  if (type.info === TypeDefInfo.Struct) {
    const components = subComponents(registry, type, nestingNumber + 1);

    return (props: ArgComponentProps<Record<string, unknown>>) => {
      return (
        <SubForm nestingNumber={nestingNumber}>
          <Struct components={components} {...props} />
        </SubForm>
      );
    };
  }

  if (type.info === TypeDefInfo.Tuple) {
    const components = subComponents(registry, type, nestingNumber + 1);

    return (props: ArgComponentProps<unknown[]>) => {
      return (
        <SubForm nestingNumber={nestingNumber}>
          <Tuple components={components} {...props} />
        </SubForm>
      );
    };
  }

  if (type.info === TypeDefInfo.Vec) {
    const [component] = subComponents(registry, type, nestingNumber + 1);

    return (props: ArgComponentProps<unknown[]>) => {
      return (
        <SubForm nestingNumber={nestingNumber}>
          <Vector component={component} {...props} />
        </SubForm>
      );
    };
  }

  if (type.info === TypeDefInfo.VecFixed) {
    if (type.sub && !Array.isArray(type.sub)) {
      switch (type.sub.type) {
        case 'u8':
          return (props: ArgComponentProps<Uint8Array>) => {
            if (!type.length) throw new Error('Fixed Vector has no length');
            return <InputBytes {...props} length={type.length * 2} />; // 2 hex chars per byte
          };
        default:
          break;
      }
    }

    const [component] = subComponents(registry, type, nestingNumber + 1);

    return (props: React.PropsWithChildren<ArgComponentProps<unknown[]>>) => (
      <SubForm nestingNumber={nestingNumber}>
        <VectorFixed component={component} {...props} />
      </SubForm>
    );
  }
  // TODO: refactor InputBytes to accept strings
  // if (type.type.startsWith('Bytes')) {
  //   return (props: ArgComponentProps<Uint8Array>) => <InputBytes {...props} />;
  // }

  switch (type.type) {
    case 'AccountId':
    case 'Address':
      return AddressSelect;

    case 'Balance':
      return InputBalance;

    case 'Hash':
      return InputHash;

    case 'bool':
      return Bool;

    case 'u8':
    case 'i8':
    case 'i32':
    case 'u32':
    case 'i64':
    case 'i128':
    case 'u64':
    case 'u128':
    case 'BN':
      return InputBn;

    default:
      return Input;
  }
}
