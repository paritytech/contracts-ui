// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback } from 'react';
import { FormField } from './form-field';
import { ArgComponentProps, OrFalsy } from 'types';

interface Props extends ArgComponentProps<unknown[]> {
  component: React.ComponentType<ArgComponentProps<unknown>>;
}

export function VectorFixed({
  component: Component,
  nestingNumber,
  onChange: _onChange,
  registry,
  typeDef,
  value,
}: Props) {
  const length = typeDef.length;

  const onChange = useCallback(
    (index: number) =>
      (newValue: OrFalsy<unknown>): void => {
        _onChange(value.map((argAtIndex, atIndex) => (atIndex === index ? newValue : argAtIndex)));
      },
    [_onChange, value],
  );

  return (
    value && (
      <div>
        {[...Array(length).keys()].map((_, index) => {
          return (
            <FormField
              key={`VecFixed-${index}`}
              label={`${index}: ${
                (typeDef.sub && !Array.isArray(typeDef.sub) && typeDef.sub.type) || ''
              }`}
            >
              <Component
                nestingNumber={nestingNumber + 1}
                onChange={onChange(index)}
                registry={registry}
                typeDef={typeDef}
                value={value[index]}
              />
            </FormField>
          );
        })}
      </div>
    )
  );
}
