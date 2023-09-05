// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useMemo, useRef, useState } from 'react';

import { isNull, isUndefined } from 'lib/util';
import type { ValidFormField, ValidateFn, Validation } from 'types';

export function useFormField<T>(
  defaultValue: T,
  validate: ValidateFn<T> = value => ({ isValid: !isNull(value), message: null }),
): ValidFormField<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [validation, setValidation] = useState<Omit<Validation, 'isError'>>(validate(value));
  const isTouched = useRef(false);

  const isError = useMemo(() => {
    if (!isTouched.current) {
      return false;
    }

    return !validation.isValid;
  }, [validation.isValid]);

  const onChange = useCallback(
    (value?: T | null) => {
      if (!isUndefined(value) && !isNull(value)) {
        setValue(value);
        setValidation(validate(value));
        isTouched.current = true;
      }
    },
    [validate],
  );

  return useMemo(
    () => ({
      isError,
      isTouched: isTouched.current,
      isValid: validation.isValid,
      isWarning: validation.isWarning || false,
      message: validation.message,
      onChange,
      value,
    }),
    [value, onChange, isError, validation.isValid, validation.isWarning, validation.message],
  );
}
