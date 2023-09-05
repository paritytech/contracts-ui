// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Identicon } from '../account/identicon';
import { ContractDocument } from 'types';
import { useApi } from 'ui/contexts';
import { displayDate } from 'lib/util';
import { getContractInfo } from 'services/chain';

interface Props {
  contract: ContractDocument;
}

export function ContractRow({ contract: { address, name, date } }: Props) {
  const { api } = useApi();
  const [isOnChain, setIsOnChain] = useState(true);

  useEffect(() => {
    getContractInfo(api, address)
      .then(info => {
        setIsOnChain(info ? true : false);
      })
      .catch(console.error);
  }, [address, api]);

  return (
    <Link
      className={`inline-flex w-full cursor-pointer items-center border border-l-0 border-r-0 border-t-0 border-gray-200 p-3 text-sm last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-elevation-1`}
      to={`/contract/${address}`}
    >
      <Identicon className="pr-2" size={18} value={address} />
      <div className="w-36">{name}</div>

      {isOnChain ? (
        <div className="flex-grow text-gray-500 dark:text-gray-400">
          {address.slice(0, 4)}...{address.slice(-4)}
        </div>
      ) : (
        <div className="mr-3 flex-grow text-xs text-gray-500 dark:text-gray-400">not on-chain</div>
      )}
      <div className="w-14 text-gray-500 dark:text-gray-400">{displayDate(date)}</div>
    </Link>
  );
}
