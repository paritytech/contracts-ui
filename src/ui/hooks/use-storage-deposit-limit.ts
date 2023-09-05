/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useBalance } from './use-balance';
import { useToggle } from './use-toggle';
import { useApi } from 'ui/contexts/api.context';
import type { OrFalsy, UseStorageDepositLimit } from 'types';
import { BN_ZERO } from 'lib/bn';

export function useStorageDepositLimit(accountId: OrFalsy<string>): UseStorageDepositLimit {
  const { api } = useApi();
  const [maximum, setMaximum] = useState<BN>();
  const [isActive, toggleIsActive] = useToggle(false);

  const storageDepositLimit = useBalance(BN_ZERO, { maxValue: maximum });

  useEffect((): void => {
    accountId &&
      api.derive.balances
        .account(accountId)
        .then(({ freeBalance }) => setMaximum(freeBalance))
        .catch(console.error);
  }, [accountId, api]);

  return {
    ...storageDepositLimit,
    maximum,
    isActive,
    toggleIsActive,
  };
}
