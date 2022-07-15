// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  DbState,
  OnInstantiateSuccess$Code,
  OnInstantiateSuccess$Hash,
  InstantiateData,
  InstantiateState,
} from 'types';

export function onInsantiateFromHash(
  { db }: DbState,
  { accountId, codeHash, name }: InstantiateData,
  onSuccess: InstantiateState['onSuccess']
): OnInstantiateSuccess$Hash {
  return async function ({ contract, status }): Promise<void> {
    if (accountId && codeHash && contract?.abi.json && (status.isInBlock || status.isFinalized)) {
      await db.contracts.add({
        abi: contract.abi.json,
        address: contract.address.toString(),
        codeHash,
        date: new Date().toISOString(),
        name: name,
      });

      onSuccess && onSuccess(contract);
    }
  };
}

export function onInstantiateFromCode(
  { db }: DbState,
  { accountId, name }: InstantiateData,
  onSuccess: InstantiateState['onSuccess']
): OnInstantiateSuccess$Code {
  return async function (result): Promise<void> {
    try {
      const { blueprint, contract, status } = result;

      if (accountId && contract && (status.isInBlock || status.isFinalized)) {
        const document = {
          abi: contract.abi.json,
          codeHash: blueprint?.codeHash.toHex() || contract.abi.info.source.wasmHash.toHex(),
          date: new Date().toISOString(),
          name,
        };

        await db.contracts.add({
          ...document,
          address: contract.address.toString(),
        });

        await db.addCodeBundle(document);

        onSuccess && onSuccess(contract, blueprint);
      }
    } catch (e) {
      console.error(e);
    }
  };
}
