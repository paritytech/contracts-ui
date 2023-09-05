// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import { useCallback } from 'react';
import { FormField } from './form-field';
import { ArgComponentProps, OrFalsy, TypeDef } from 'types';

interface Props extends ArgComponentProps<unknown[]> {
  components: React.ComponentType<ArgComponentProps<unknown>>[];
}

export function Tuple({
  className,
  components,
  nestingNumber,
  onChange: _onChange,
  registry,
  typeDef,
  value,
}: Props) {
  const onChange = useCallback(
    (index: number) =>
      (newValue: OrFalsy<unknown>): void => {
        _onChange(value.map((argAtIndex, atIndex) => (atIndex === index ? newValue : argAtIndex)));
      },
    [_onChange, value],
  );

  return (
    <div className={className}>
      {components.map((Component, index) => {
        const subType = (typeDef.sub as TypeDef[])[index];

        return (
          <FormField
            className={`tuple-field-${nestingNumber}`}
            key={`Tuple-${index}`}
            label={`${index}: ${encodeTypeDef(registry, subType)}`}
          >
            <Component
              nestingNumber={nestingNumber}
              onChange={onChange(index)}
              registry={registry}
              typeDef={subType}
              value={(value || [])[index] || ''}
            />
          </FormField>
        );
      })}
    </div>
  );
}
