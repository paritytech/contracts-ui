// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { hexToU8a } from '@polkadot/util';
import React, { useCallback, useMemo, useState } from 'react';
import { Input } from './input';
import { classes } from 'lib/util';
import { ArgComponentProps } from 'types';

type Props = ArgComponentProps<Uint8Array> & { length?: number };
type Validation = { isValid: boolean; message?: string };

const isHexRegex = /^0x[A-F0-9]+$/i;
const validateFn =
  (length = 64) =>
  (value: string): Validation => {
    if (!isHexRegex.test(value)) {
      return { isValid: false, message: 'Not a valid hex string' };
    }

    const expectedLength = length + 2; // +2 for 0x prefix
    if (value.length < expectedLength) {
      return { isValid: false, message: `Input too short! Expecting ${length} characters.` };
    }
    if (value.length > expectedLength) {
      return { isValid: false, message: `Input too long! Expecting ${length} characters.` };
    }

    return {
      isValid: true,
      message: '',
    };
  };

export function InputBytes({ onChange, className, length }: Props): React.ReactElement<Props> {
  const [value, setValue] = useState('');
  const [{ isValid, message }, setValidation] = useState<Validation>({ isValid: true });
  const validate = useMemo(() => validateFn(length), [length]);

  const handleChange = useCallback(
    (d: string) => {
      setValue(d);
      const validation = validate(d);
      setValidation(validation);
      if (validation.isValid) {
        try {
          onChange(hexToU8a(d));
        } catch (e) {
          console.error(e);
        }
      } else {
        // TODO shouldn't this unset the value in error and invalid case to prevent form submission?
      }
    },
    [onChange, validate],
  );

  return (
    <>
      <div className="relative flex w-full items-center">
        <Input
          className={classes('flex-1', className)}
          onChange={handleChange}
          placeholder="0x0000000000000000000000000000000000000000"
          type="text"
          value={value}
        />
      </div>
      {!isValid && <div className="mt-1 basis-full text-xs text-red-600">{message}</div>}
    </>
  );
}
