// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { classes } from 'lib/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode;
  emptyView?: React.ReactNode;
}

export const SidePanel = ({ children, className, header, emptyView = '' }: Props) => {
  return (
    <div
      className={classes('mb-8 rounded-md border border-gray-200 dark:border-gray-700', className)}
    >
      <div className="rounded-t-md border-b border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-elevation-1 dark:text-gray-300">
        {header}
      </div>
      <div>
        {children}
        {(!children || (children as unknown[]).length === 0) && (
          <p className="p-4 text-xs text-gray-400">{emptyView || ''}</p>
        )}
      </div>
    </div>
  );
};
