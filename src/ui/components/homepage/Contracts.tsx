// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FolderOpenIcon, TrashIcon } from '@heroicons/react/outline';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContractRow } from '../contract/contract-row';
import { ForgetAllContractsModal } from 'ui/components/modal';
import { useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function Contracts(): React.ReactElement | null {
  const { db } = useDatabase();
  const [isOpen, setIsOpen] = useState(false);
  const [contracts, isLoading] = useDbQuery(() => db.contracts.toArray(), [db]);
  const forgetAllContracts = useCallback(() => db.contracts.clear(), [db]);

  if (isLoading || !contracts) {
    return null;
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-2 rounded border px-5 py-7  text-sm dark:border-gray-700 dark:text-gray-500">
        <FolderOpenIcon className="h-8 w-8" />
        <div>You haven&apos;t uploaded any contracts yet on this browser.</div>
        <Link className="text-green-500" to={`/instantiate`}>
          Upload a new contract
        </Link>
      </div>
    );
  }

  return (
    <>
      <ForgetAllContractsModal confirm={forgetAllContracts} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div>
        <div className="w-auto border-collapse overflow-hidden rounded border border-gray-200 dark:border-gray-700">
          {contracts?.map(contract => {
            return <ContractRow contract={contract} key={`contract-${contract.address}`} />;
          })}
        </div>
        <div className="grid justify-items-end pt-4">
          <button
            className="flex h-full items-center rounded border p-3 font-semibold text-gray-600 hover:text-gray-400 dark:border-gray-700 dark:bg-elevation-1 dark:text-gray-300 dark:hover:bg-elevation-2"
            onClick={() => setIsOpen(true)}
            title="Forget All Contracts"
          >
            <p className="mr-2 text-xs">Forget All Contracts</p>
            <TrashIcon className="mr-1 w-4 justify-self-end dark:text-gray-500" />
          </button>
        </div>
      </div>
    </>
  );
}
