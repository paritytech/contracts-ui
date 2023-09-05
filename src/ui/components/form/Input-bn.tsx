// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import BN from 'bn.js';
import { InputNumber } from './input-number';
import { ArgComponentProps } from 'types';

type Props = ArgComponentProps<BN>;

function getMinMax(type: string): [bigint, bigint] {
  switch (type) {
    case 'i8':
      return [-128n, 127n];
    case 'i16':
      return [-32768n, 32767n];
    case 'i32':
      return [-2147483648n, 2147483647n];
    case 'i64':
      return [-9223372036854775808n, 9223372036854775807n];
    case 'i128':
      return [-170141183460469231731687303715884105728n, 170141183460469231731687303715884105727n];
    case 'u8':
      return [0n, 255n];
    case 'u16':
      return [0n, 65535n];
    case 'u32':
      return [0n, 4294967295n];
    case 'u64':
      return [0n, 18446744073709551615n];
    case 'u128':
      return [0n, 340282366920938463463374607431768211455n];
    default:
      return [-BigInt(Number.MAX_SAFE_INTEGER), BigInt(Number.MAX_SAFE_INTEGER)];
  }
}

export function InputBn({ onChange, typeDef: { type } }: Props): JSX.Element {
  const [displayValue, setDisplayValue] = useState('0');
  const [min, max] = getMinMax(type);

  const handleChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      if (value.trim()) {
        const val = Number(value);
        if (!Number.isNaN(val) && min <= val && val <= max) {
          const bn = new BN(value);
          setDisplayValue(value);
          onChange(bn);
        }
      }
    },
    [max, min, onChange],
  );

  return (
    <>
      <InputNumber
        data-cy="bn-input"
        onChange={handleChange}
        placeholder="Input a number"
        value={displayValue}
      />
    </>
  );
}
