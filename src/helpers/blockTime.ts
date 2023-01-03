// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BN } from 'bn.js';
import { BN_TWO } from './bn';
import { ApiPromise } from 'types';

const DEFAULT_TIME = new BN(6_000);

export function blockTimeMs(a: ApiPromise) {
  return a.query.parachainSystem
    ? // default guess for a parachain
      DEFAULT_TIME.mul(BN_TWO)
    : // default guess for others
      DEFAULT_TIME;
}
