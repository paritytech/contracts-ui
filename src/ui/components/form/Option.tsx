// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useEffect, useRef } from 'react';
import { Switch } from '../common/switch';
import { Input } from './input';
import { ArgComponentProps, OrFalsy, Registry, TypeDef } from 'types';
import { useApi } from 'ui/contexts';
import { NOOP } from 'lib/util';
import { useToggle } from 'ui/hooks/use-toggle';
import { getInitValue } from 'lib/init-value';

interface Props extends ArgComponentProps<unknown> {
  component: React.ComponentType<ArgComponentProps<unknown>>;
  registry: Registry;
  typeDef: TypeDef;
}

export function Option({
  component: Component,
  onChange: _onChange,
  nestingNumber,
  registry,
  typeDef,
  value = null,
}: Props) {
  const { accounts } = useApi();
  const [isSupplied, toggleIsSupplied] = useToggle(value !== null);
  const isSuppliedRef = useRef(isSupplied);

  const onChange = useCallback(
    (value: OrFalsy<unknown>): void => {
      if (!isSupplied) {
        _onChange(null);

        return;
      }

      _onChange(value);
    },
    [_onChange, isSupplied],
  );

  useEffect((): void => {
    if (isSupplied && !isSuppliedRef.current && value === null && accounts) {
      onChange(getInitValue(registry, accounts, typeDef.sub as TypeDef));
      isSuppliedRef.current = true;
    } else if (!isSupplied && isSuppliedRef.current && value !== null) {
      onChange(null);
      isSuppliedRef.current = false;
    }
  }, [accounts, registry, onChange, value, isSupplied, typeDef.sub]);

  return (
    <div className="flex items-start" data-cy="option-field">
      {isSupplied ? (
        <div className="flex-1">
          <Component
            nestingNumber={nestingNumber + 1}
            onChange={onChange}
            registry={registry}
            typeDef={typeDef.sub as TypeDef}
            value={value}
          />
        </div>
      ) : (
        <div className="flex-1">
          <Input isDisabled onChange={NOOP} placeholder="Do not supply" value="" />
        </div>
      )}
      <div className="my-2.5 flex w-18 items-center justify-center">
        <Switch onChange={toggleIsSupplied} value={isSupplied} />
      </div>
    </div>
  );
}
