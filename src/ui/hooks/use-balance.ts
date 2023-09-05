// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { useCallback } from 'react';
import { useFormField } from './use-form-field';
import { toBalance, toSats, BN_ONE, BN_TWO, BN_ZERO, isBn } from 'lib/bn';
import { useApi } from 'ui/contexts/api.context';
import type { UseBalance, Validation } from 'types';

type BitLength = 8 | 16 | 32 | 64 | 128 | 256;

const DEFAULT_BITLENGTH = 128;

interface ValidateOptions {
  bitLength?: BitLength;
  isZeroable?: boolean;
  maxValue?: BN;
}

function getGlobalMaxValue(bitLength?: number): BN {
  return BN_TWO.pow(new BN(bitLength || DEFAULT_BITLENGTH)).isub(BN_ONE);
}

export function useBalance(
  initialValue: BN | string | number = 0,
  { bitLength = DEFAULT_BITLENGTH, isZeroable = true, maxValue }: ValidateOptions = {},
): UseBalance {
  const { api } = useApi();

  const validate = useCallback(
    (value: BN | null | undefined): Validation => {
      let message: React.ReactNode;
      let isError = false;

      if (!value) {
        isError = true;
        return {
          isError,
        };
      }

      if (value?.lt(BN_ZERO)) {
        isError = true;
        message = 'Value cannot be negative';
      }

      if (value?.gt(getGlobalMaxValue(bitLength))) {
        isError = true;
        message = 'Value exceeds global maximum';
      }

      if (!isZeroable && value?.isZero()) {
        isError = true;
        message = 'Value cannot be zero';
      }

      if (value && value?.bitLength() > (bitLength || DEFAULT_BITLENGTH)) {
        isError = true;
        message = "Value's bitlength is too high";
      }

      if (maxValue && maxValue.gtn(0) && value?.gt(maxValue)) {
        isError = true;
        message = `Value exceeds available balance`;
      }

      return {
        isError,
        isValid: !isError,
        message,
      };
    },
    [bitLength, isZeroable, maxValue],
  );

  const balance = useFormField<BN>(
    isBn(initialValue) ? toSats(api, initialValue) : toBalance(api, initialValue),
    validate,
  );

  return balance;
}
