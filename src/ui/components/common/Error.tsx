// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { classes } from 'ui/util';

type Props = React.HTMLProps<HTMLDivElement>;

export function Error({ children, className }: Props) {
  return (
    <div className={classes('page-error', className)} data-cy="error-card">
      <div>
        <ExclamationCircleIcon className="w-10 h-10 text-red-400 mb-1" />
        {children}
      </div>
    </div>
  );
}
