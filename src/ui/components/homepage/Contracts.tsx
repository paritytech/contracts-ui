// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FolderOpenIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { ContractRow } from '../contract/ContractRow';
import { useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function Contracts(): React.ReactElement | null {
  const { db } = useDatabase();
  const [contracts, isLoading] = useDbQuery(() => db.contracts.toArray(), [db]);

  if (isLoading || !contracts) {
    return null;
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-2 text-sm border dark:text-gray-500 dark:border-gray-700  rounded py-7 px-5">
        <FolderOpenIcon className="w-8 h-8" />
        <div>No contracts found on this chain.</div>
        <Link to={`/add/instantiate`} className="text-green-500">
          Upload a new contract
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-collapse overflow-hidden dark:border-gray-700 border-gray-200 rounded w-auto">
      {contracts?.map(contract => {
        return <ContractRow contract={contract} key={`contract-${contract.address}`} />;
      })}
    </div>
  );
}
