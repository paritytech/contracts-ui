// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Identicon } from './identicon';
import { classes, truncate } from 'lib/util';
import { OrFalsy } from 'types';
import { useApi } from 'ui/contexts';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name?: React.ReactNode;
  value: OrFalsy<string>;
  size?: number;
}

export function Account({ className, name: propsName, size = 42, value }: Props) {
  const { accounts } = useApi();

  const account = accounts?.find(a => a.address === value);
  const name = propsName || account?.meta.name;

  if (!value) {
    return null;
  }

  return (
    <div className={classes('inline-flex items-center', className)}>
      <Identicon className="pr-2" size={size} value={value} />
      <div className="block flex-1 truncate">
        {name && (
          <span
            className="flex text-base font-semibold text-gray-700 dark:text-gray-300"
            data-cy="account-name"
          >
            {name}
          </span>
        )}
        <p className="text-xs text-gray-500" data-cy="account-address">
          {truncate(value, 4)}
        </p>
      </div>
    </div>
  );
}
