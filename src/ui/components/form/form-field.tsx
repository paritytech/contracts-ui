// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/outline';
import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import type { Validation } from 'types';
import { classes } from 'lib/util';

type ValidationState = 'error' | 'success' | 'warning' | null;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  help?: React.ReactNode;
}

export function getValidation({
  isError,
  isSuccess,
  isValid,
  isWarning,
  message,
}: Validation): Validation {
  return { isError, isSuccess, isValid, isWarning, message };
}

export function FormField({
  children,
  className,
  help,
  id,
  isError,
  isSuccess,
  isWarning,
  label,
  message,
}: Props & Validation) {
  const validationState = useMemo((): ValidationState => {
    if (!message) return null;

    if (isError) return 'error';
    if (isWarning) return 'warning';
    if (isSuccess) return 'success';

    return null;
  }, [isError, isSuccess, isWarning, message]);

  return (
    <div className={classes('form-field', className)}>
      {label && (
        <label data-tip={help} htmlFor={id}>
          {label}
          {help && (
            <>
              <InformationCircleIcon data-tip data-tooltip-id={`formFieldHelp-${id}`} />
              <Tooltip id={`formFieldHelp-${id}`}>{help}</Tooltip>
            </>
          )}
        </label>
      )}
      {children}
      {message && validationState && (
        <div className={classes('validation', validationState && validationState)}>
          {['error', 'warning'].includes(validationState) && <ExclamationCircleIcon />}
          {validationState === 'success' && <CheckCircleIcon />}
          {message}
        </div>
      )}
    </div>
  );
}

export function Form({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classes('mb-6', className)} {...props}>
      {children}
    </div>
  );
}
