// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DecodedEvent } from '@polkadot/api-contract/types';
import BN from 'bn.js';
import type {
  AbiMessage,
  ContractPromise,
  EventRecord,
  RegistryError,
  Balance,
} from '../substrate';

export interface ContractDryRunParams {
  contract: ContractPromise;
  message: AbiMessage;
  payment: BN;
  address: string;
  argValues?: Record<string, unknown>;
}

export interface CallResult {
  id: number;
  events: EventRecord[];
  contractEvents?: DecodedEvent[];
  message: AbiMessage;
  error?: RegistryError;
  time: number;
}

export type UIStorageDeposit = {
  value?: Balance;
  type: 'charge' | 'refund' | 'empty';
};
