// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApi, useDatabase } from 'ui/contexts';
import { ContractDocument, ContractPromise, UIContract } from 'types';

export function useStoredContract(address: string): UIContract | undefined {
  const navigate = useNavigate();
  const { api } = useApi();
  const { db } = useDatabase();
  const [contract, setContract] = useState<ContractPromise>();
  const [document, setDocument] = useState<ContractDocument>();

  useLiveQuery(async () => {
    // setting to undefined to prevent metadata "leak" on route change
    // https://github.com/paritytech/contracts-ui/issues/359
    setContract(undefined);
    setDocument(undefined);
    const d = await db.contracts.get({ address });
    if (!d) {
      navigate('/');
    } else {
      const c = new ContractPromise(api, d.abi, address);
      setDocument(d);
      setContract(c);
    }
  }, [address]);

  if (!document || !contract) return undefined;

  return {
    abi: contract.abi,
    name: contract.abi.info.contract.name.toString(),
    displayName: document.name,
    tx: contract.tx,
    codeHash: document.codeHash,
    address: contract.address.toString(),
    date: document.date,
    id: document.id,
    type: document.external ? 'added' : 'instantiated',
  };
}
