// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useState } from 'react';
import BN from 'bn.js';

import { InputNumber } from './input-number';
import { classes } from 'lib/util';
import { ApiPromise, OrFalsy, SimpleSpread } from 'types';
import { useApi } from 'ui/contexts';
import { BN_ZERO, fromBalance, fromSats, toBalance } from 'lib/bn';

type Props = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    value?: BN;
    onChange: (_: BN) => void;
    withUnits?: boolean;
  }
>;

function getStringValue(api: ApiPromise, value: OrFalsy<BN>) {
  if (!value) {
    return '';
  }

  return fromBalance(fromSats(api, value || BN_ZERO));
}

function InputBalanceBase({
  children,
  className,
  value,
  onChange,
  withUnits = true,
  ...inputProps
}: Props) {
  const { api, tokenSymbol } = useApi();

  const [stringValue, setStringValue] = useState(getStringValue(api, value));

  return (
    <>
      <div className={classes('relative rounded-md shadow-sm', className)}>
        <InputNumber
          className="input-balance"
          min="0"
          onChange={e => {
            const val = e.target.value;
            if (val.length < 26) {
              const bn = toBalance(api, val);
              onChange(bn);
              setStringValue(val);
            }
          }}
          value={stringValue ?? 0}
          {...inputProps}
        />
        {withUnits && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            <span className="mr-7 text-gray-500 sm:text-sm">{tokenSymbol}</span>
          </div>
        )}
        {children}
      </div>
    </>
  );
}

export const InputBalance = React.memo(InputBalanceBase);
