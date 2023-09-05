// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import React, { useCallback } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/outline';
import { Button, Buttons } from '../common';
import { FormField } from './form-field';
import { TypeDef, ArgComponentProps, OrFalsy } from 'types';

import { useApi } from 'ui/contexts';
import { getInitValue } from 'lib/init-value';

interface Props extends ArgComponentProps<unknown[]> {
  component: React.ComponentType<ArgComponentProps<unknown>>;
}

export function Vector({
  component: Component,
  nestingNumber,
  onChange: _onChange,
  registry,
  typeDef,
  value = [],
}: Props) {
  const { accounts } = useApi();
  const subType = typeDef.sub as TypeDef;

  const onAddRow = useCallback((): void => {
    _onChange([...value, getInitValue(registry, accounts || [], subType)]);
  }, [_onChange, value, accounts, registry, subType]);

  const onRemoveRow = useCallback(() => _onChange(value.slice(0, -1)), [_onChange, value]);

  const onChange = useCallback(
    (index: number) =>
      (newValue: OrFalsy<unknown>): void => {
        _onChange(value.map((argAtIndex, atIndex) => (atIndex === index ? newValue : argAtIndex)));
      },
    [_onChange, value],
  );

  return (
    <div>
      <div className={'flex justify-start'}>
        <label className="flex-1 font-bold text-gray-600 arg-label dark:text-white">
          {`Vec<${encodeTypeDef(registry, subType)}>`}
        </label>
        <Buttons>
          <Button
            className="px-2 dark:text-white"
            data-cy={`vector-add-${nestingNumber}`}
            onClick={onAddRow}
            variant="default"
          >
            <PlusIcon className="w-3 h-3 dark:text-white" />
          </Button>
          <Button
            className="px-2 dark:text-white"
            data-cy={`vector-remove-${nestingNumber}`}
            onClick={onRemoveRow}
            variant="default"
          >
            <MinusIcon className="w-3 h-3 dark:text-white" />
          </Button>
        </Buttons>
      </div>
      {(value || []).map((element, index) => {
        return (
          <FormField
            className={`vector-field-${nestingNumber}`}
            key={`Vector-${index}`}
            label={`${index}`}
          >
            <Component
              nestingNumber={nestingNumber + 1}
              onChange={onChange(index)}
              registry={registry}
              typeDef={subType}
              value={element}
            />
          </FormField>
        );
      })}
    </div>
  );
}
