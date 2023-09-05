// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChevronRightIcon, TrashIcon } from '@heroicons/react/outline';
import { useEffect, useMemo, useState } from 'react';
import { CopyButton } from 'ui/components/common/copy-button';
import { checkOnChainCode } from 'services/chain';
import { SimpleSpread, VoidFn } from 'types';
import { useApi, useDatabase } from 'ui/contexts';
import { classes, truncate } from 'lib/util';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLButtonElement>,
  {
    codeHash: string;
    date?: string;
    error?: React.ReactNode;
    isError?: boolean;
    isSuccess?: boolean;
    name?: string;
    onClick?: VoidFn;
    onDelete?: VoidFn;
  }
>;

export function CodeHash({
  className,
  codeHash,
  date,
  error,
  isError,
  isSuccess,
  name,
  onClick,
}: Props) {
  const { api } = useApi();
  const { db } = useDatabase();
  const [isOnChain, setIsOnChain] = useState(true);
  const parsedDate = useMemo(() => (date ? new Date(date) : undefined), [date]);

  useEffect(() => {
    checkOnChainCode(api, codeHash)
      .then(codeStorageExists => {
        setIsOnChain(codeStorageExists ? true : false);
      })
      .catch(console.error);
  }, [api, codeHash]);

  return (
    <div
      className={classes(
        'group flex items-center rounded border p-4 dark:border-gray-700 dark:bg-elevation-1',
        isOnChain &&
          onClick &&
          'cursor-pointer dark:hover:border-blue-500 dark:hover:bg-blue-700 dark:hover:bg-opacity-10',
        isError && 'dark:border-red-500 dark:bg-red-900 dark:bg-opacity-20',
        isSuccess && isOnChain && 'dark:border-green-500 dark:bg-green-900 dark:bg-opacity-20',
        className,
      )}
      onClick={isOnChain && onClick ? onClick : undefined}
    >
      <div className={classes('flex-1', !isOnChain && 'opacity-40')}>
        <div className="mb-1 dark:text-white">
          {!isError ? name || 'On-chain Code Hash' : 'Invalid Code Hash'}
        </div>
        <div className="flex gap-4 text-sm dark:text-gray-500">
          {codeHash && !isError && (
            <div className="flex gap-1">
              Code hash: {truncate(codeHash)}
              <CopyButton id={codeHash} value={codeHash} />
            </div>
          )}
          {parsedDate && !isError && (
            <div>
              Uploaded: {`${parsedDate.toLocaleDateString()} ${parsedDate.toLocaleTimeString()}`}
            </div>
          )}
        </div>
        {isError && <div className="text-sm dark:text-gray-500">{error}</div>}
      </div>
      {onClick && isOnChain && (
        <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 dark:group-hover:border-blue-500" />
      )}
      {!isOnChain && (
        <>
          <span className="mr-3 text-xs font-semibold text-red-400">Not on-chain</span>
          <button
            className="flex items-center h-full p-1 font-semibold text-gray-500 border rounded hover:text-gray-400 dark:border-gray-700 dark:bg-elevation-1 dark:text-gray-300 dark:hover:bg-elevation-2"
            onClick={async () => {
              const toDelete = await db.codeBundles.get({ codeHash });

              if (toDelete?.id) {
                await db.codeBundles.delete(toDelete.id);
              }
            }}
            title="Forget code hash"
          >
            <TrashIcon className="w-4 mr-1 justify-self-end dark:text-gray-500" />
          </button>
        </>
      )}
    </div>
  );
}
