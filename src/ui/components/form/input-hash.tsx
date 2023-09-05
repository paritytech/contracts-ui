// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { InputHex } from './input-hex';
import { ArgComponentProps, Hash } from 'types';

type Props = ArgComponentProps<Hash>;

type Validation = { isValid: boolean; message?: string };

function validate(value: string): Validation {
  if (value.length < 64) {
    return { isValid: false, message: 'Input too short! Expecting 64 characters.' };
  }
  if (value.length > 64) {
    return { isValid: false, message: 'Input too long! Expecting 64 characters.' };
  }
  return {
    isValid: true,
    message: '',
  };
}

export function InputHash({ registry, onChange, className }: Props) {
  const [{ isValid, message }, setValidation] = useState<Validation>({ isValid: true });
  const handleChange = useCallback(
    (d: string) => {
      const validation = validate(d);
      setValidation(validation);
      if (validation.isValid) {
        try {
          const x = registry.createType('H256', `0x${d}`);
          onChange(x);
        } catch (e) {
          console.error(e);
        }
      }
    },
    [onChange, registry],
  );
  return (
    <InputHex
      className={className}
      defaultValue={registry.createType('H256').toString().slice(2)}
      error={!isValid ? message : undefined}
      onChange={handleChange}
    />
  );
}
