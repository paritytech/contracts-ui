// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { Input } from './input';
import { classes } from 'lib/util';

interface Props {
  onChange: (_: string) => void;
  className?: string;
  defaultValue?: string;
  error?: string;
}

export function InputHex({ onChange, className, defaultValue, error }: Props) {
  const [value, setValue] = useState(defaultValue ?? '');

  const handleChange = useCallback(
    (d: string) => {
      const regex = /^(0x|0X)?[a-fA-F0-9]+$/;
      if (!d || regex.test(d)) {
        setValue(d);
        onChange(d);
      }
    },
    [onChange],
  );
  return (
    <>
      <div className="relative flex w-full items-center">
        <span className="absolute left-3 text-sm text-gray-400">0x</span>
        <Input
          className={classes('flex-1 pl-8', className)}
          onChange={handleChange}
          placeholder="hexadecimal text"
          type="text"
          value={value}
        />
      </div>
      <div className="mt-1 basis-full text-xs text-red-600">{error}</div>
    </>
  );
}
