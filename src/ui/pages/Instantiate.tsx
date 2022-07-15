// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link, useParams } from 'react-router-dom';
import { InstantiateContextProvider } from 'ui/contexts';
import { Wizard } from 'ui/components/instantiate';

export function Instantiate() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-5 py-3 m-2">
      <div className="grid md:grid-cols-12 gap-5">
        <div className="md:col-span-9 p-4">
          <div className="space-y-1 border-b pb-6 dark:border-gray-800 border-gray-200">
            <h1 className="text-2.5xl font-semibold dark:text-white text-gray-700">
              {codeHashUrlParam
                ? 'Instantiate Contract from Code Hash'
                : 'Upload and Instantiate Contract'}
            </h1>
            <p className="dark:text-gray-400 text-gray-500 text-sm">
              {codeHashUrlParam ? (
                <>
                  You can upload and instantate new contract code{' '}
                  <Link to="/add/instantiate" className="text-blue-500">
                    here
                  </Link>
                  .
                </>
              ) : (
                <>
                  You can instantiate a new contract from an existing code bundle{' '}
                  <Link to="/add/code-hash" className="text-blue-500">
                    here
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <InstantiateContextProvider>
        <Wizard />
      </InstantiateContextProvider>
    </div>
  );
}
