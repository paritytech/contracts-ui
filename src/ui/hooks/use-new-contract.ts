// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import type { BlueprintSubmittableResult } from 'types';
import { useDatabase, useInstantiate } from 'ui/contexts';

export function useNewContract() {
  const { db } = useDatabase();
  const navigate = useNavigate();
  const {
    data: { accountId, name },
  } = useInstantiate();

  return async function ({ contract }: BlueprintSubmittableResult<'promise'>): Promise<void> {
    if (accountId && contract?.abi.json) {
      const codeHash = contract.abi.info.source.wasmHash.toHex();
      const document = {
        abi: contract.abi.json,
        address: contract.address.toString(),
        codeHash,
        date: new Date().toISOString(),
        name,
      };

      await Promise.all([
        db.contracts.add(document),
        db.codeBundles.get({ codeHash }).then(codeBundle => {
          if (!codeBundle) {
            return db.codeBundles.add(document);
          }
        }),
      ]);

      navigate(`/contract/${contract.address}`);
    }
  };
}
