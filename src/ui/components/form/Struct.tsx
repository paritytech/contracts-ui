// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import { FormField } from './form-field';
import { TypeDefInfo, ArgComponentProps } from 'types';

type Props = ArgComponentProps<Record<string, unknown>> & {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
};

export function Struct({ components, value, nestingNumber, onChange, registry, typeDef }: Props) {
  const _onChange = (name: string) => (newEntry: unknown) => {
    const newValue = { ...value, [name]: newEntry };
    onChange(newValue);
  };
  const subTypes =
    typeDef.info === TypeDefInfo.Si
      ? registry.lookup.getTypeDef(typeDef.type as `Lookup${number}`).sub
      : typeDef.sub;
  return (
    <div>
      {subTypes &&
        components &&
        components.map((Component, index) => {
          const subType = Array.isArray(subTypes) ? subTypes[index] : subTypes;
          const name = subType.displayName || subType.name || '';

          return (
            <FormField
              className={name}
              key={`${typeDef.name}-label-${index}`}
              label={`${name}: ${subType.typeName || encodeTypeDef(registry, subType)}`}
            >
              <Component
                nestingNumber={nestingNumber + 1}
                onChange={_onChange(name)}
                registry={registry}
                typeDef={subType}
                value={value ? value[name] : ''}
              />
            </FormField>
          );
        })}
    </div>
  );
}
