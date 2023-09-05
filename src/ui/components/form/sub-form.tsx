// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { classes } from 'lib/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  nestingNumber: number;
}

export function SubForm({ children, className, nestingNumber }: Props) {
  const isOddNesting = nestingNumber % 2 != 0;

  return (
    <div
      className={classes(
        'rounded border border-gray-200 p-4 text-left text-sm dark:border-gray-500',
        isOddNesting ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-elevation-1',
        className,
      )}
    >
      {children}
    </div>
  );
}
