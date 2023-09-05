// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router-dom';
import { Error } from './error';
import { useApi } from 'ui/contexts';
import { ROCOCO_CONTRACTS, LOCAL } from 'src/constants';

function ContractsNodeHelp() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          Make sure you are running a local{' '}
          <a
            className="whitespace-nowrap"
            href="https://github.com/paritytech/substrate-contracts-node"
            rel="noreferrer"
            target="_blank"
          >
            substrate-contracts-node
          </a>
          .
        </div>
        <div className="mt-1 rounded bg-slate-200 px-3 py-1 font-mono text-sm dark:bg-slate-800 dark:text-gray-400">
          substrate-contracts-node --dev
        </div>
      </div>
      <div>
        Alternatively, connect to{' '}
        <a
          className="whitespace-nowrap"
          href="#"
          onClick={() => {
            navigate(`/?rpc=${ROCOCO_CONTRACTS.rpc}`);
          }}
        >
          Contracts parachain on Rococo.
        </a>
      </div>
    </>
  );
}

export function ConnectionError() {
  const { endpoint } = useApi();

  return (
    <Error>
      <div>Could not connect to {endpoint}</div>
      {endpoint === LOCAL.rpc && <ContractsNodeHelp />}
    </Error>
  );
}
