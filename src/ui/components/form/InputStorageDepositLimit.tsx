// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Big from 'big.js';
import { useMemo } from 'react';
import { Meter, Switch } from '../common';
import { InputBalance } from './InputBalance';
import { getValidation } from './FormField';
import type { SimpleSpread, UseStorageDepositLimit } from 'types';
import { classes, isNull, isNumber } from 'helpers';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  UseStorageDepositLimit & {
    isActive?: boolean;
    toggleIsActive: () => void;
  }
>;

export function InputStorageDepositLimit({
  className,
  isActive = false,
  maximum,
  onChange,
  toggleIsActive,
  value,
  ...props
}: Props) {
  const percentage = useMemo((): number | null => {
    if (!maximum || maximum.eqn(0)) {
      return null;
    }

    return 100 * new Big(value.toString()).div(new Big(maximum.toString())).toNumber();
  }, [maximum, value]);

  return (
    <div className={classes(className)}>
      <div className="flex items-center justify-between">
        <InputBalance
          className={`flex-1 ${!isActive && 'text-gray-300 dark:text-gray-500'}`}
          value={isActive ? value : undefined}
          id="storageDepositLimit"
          disabled={!isActive}
          onChange={onChange}
          placeholder={isActive ? undefined : 'Do not use'}
          withUnits={isActive}
          {...getValidation(props)}
        />
        <div className="flex justify-end items-center w-11">
          <Switch value={isActive} onChange={toggleIsActive} />
        </div>
      </div>
      {isActive && !isNull(percentage) && (
        <Meter label={isNumber(percentage) ? `${percentage.toFixed(4)}% of free balance` : null} />
      )}
    </div>
  );
}
