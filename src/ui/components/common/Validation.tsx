// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type: 'error' | 'success' | 'warning';
}

export function Validation({ children, type, ...props }: Props) {
  let Icon;

  switch (type) {
    case 'error':
    case 'warning':
      Icon = ExclamationCircleIcon;
      break;

    case 'success':
      Icon = CheckCircleIcon;
      break;
  }
  return (
    <div className={classes('validation', type, props.className)}>
      <Icon className="mr-3" />
      {children}
    </div>
  );
}
