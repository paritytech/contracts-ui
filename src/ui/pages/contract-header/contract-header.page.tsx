// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link } from 'react-router-dom';
import { CopyButton } from '../../components/common/copy-button';
import { displayDate, truncate } from 'lib/util';
import { UIContract } from 'types';

interface Props {
  document: UIContract;
}

export function ContractHeader({ document: { name, type, address, date, codeHash } }: Props) {
  switch (type) {
    case 'added':
      return (
        <div>
          You added this contract from{' '}
          <div className="inline-flex items-center">
            <span className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400">
              {truncate(address, 4)}
            </span>
            <CopyButton className="ml-1" id="header-address" value={address} />
          </div>{' '}
          on {displayDate(date)}
        </div>
      );
    case 'instantiated':
      return (
        <div>
          You instantiated this contract{' '}
          <div className="inline-flex items-center">
            <span className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400">
              {truncate(address, 4)}
            </span>
            <CopyButton className="ml-1" id="header-address" value={address} />
          </div>{' '}
          from{' '}
          <Link
            className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400"
            to={`/instantiate/${codeHash}`}
          >
            {name}
          </Link>{' '}
          on {displayDate(date)}
        </div>
      );
  }
}
