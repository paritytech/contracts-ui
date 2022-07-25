// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Identicon } from './Identicon';
import { classes, truncate } from 'ui/util';
import { OrFalsy } from 'types';
import { useAccount } from 'ui/hooks/useAccount';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name?: React.ReactNode;
  value: OrFalsy<string>;
  size?: number;
}

export function Account({ className, name: propsName, size = 42, value }: Props) {
  const account = useAccount(value);
  const name = propsName || account?.meta.name;

  if (!value) {
    return null;
  }

  return (
    <div className={classes('inline-flex items-center', className)}>
      <Identicon size={size} value={value} className="pr-2" />
      <div className="flex-1 block truncate">
        {name && (
          <span
            className="flex font-semibold text-base dark:text-gray-300 text-gray-700"
            data-cy="account-name"
          >
            {name}
          </span>
        )}
        <p data-cy="account-address" className="text-gray-500 text-xs">
          {truncate(value, 4)}
        </p>
      </div>
    </div>
  );
}
