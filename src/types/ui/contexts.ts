// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { keyring } from '@polkadot/ui-keyring';

import type {
  Abi,
  ApiPromise,
  ContractInstantiateResult,
  SubmittableExtrinsic,
  SubmittableResult,
  ChainType,
  WeightV2,
  Bytes,
  Balance,
} from '../substrate';

export type Status = 'loading' | 'connected' | 'error';

export interface ApiState extends ChainProperties {
  endpoint: string;
  setEndpoint: (e: string) => void;
  status: Status;
  api: ApiPromise;
  accounts?: Account[];
}

export interface ChainProperties {
  tokenDecimals: number;
  systemName: string | null;
  systemVersion: string | null;
  systemChainType: ChainType;
  systemChain: string;
  tokenSymbol: string;
  genesisHash: string;
}

export interface InstantiateData {
  accountId: string;
  argValues?: Record<string, unknown>;
  value?: Balance;
  metadata?: Abi;
  name: string;
  constructorIndex: number;
  salt: string | Uint8Array | Bytes | null;
  storageDepositLimit: Balance | null;
  gasLimit: WeightV2 | undefined;
  codeHash?: string;
}

export type Step2FormData = Omit<InstantiateData, 'accountId' | 'name'>;

export interface InstantiateState {
  data: InstantiateData;
  setData: React.Dispatch<React.SetStateAction<InstantiateData>>;
  step: 1 | 2 | 3;
  setStep: React.Dispatch<1 | 2 | 3>;
  dryRunResult?: ContractInstantiateResult;
  setDryRunResult: (_: ContractInstantiateResult) => void;
}

export type InstantiateProps = InstantiateState;

export enum TxStatus {
  Error = 'error',
  Success = 'success',
  Processing = 'processing',
  Queued = 'queued',
}
export interface TxOptions {
  extrinsic: SubmittableExtrinsic<'promise'>;
  accountId: string;
  isValid: (_: SubmittableResult) => boolean;
  onSuccess?: ((_: SubmittableResult) => void) | ((_: SubmittableResult) => Promise<void>);
  onError?: (result: SubmittableResult) => void;
}

export interface QueuedTxOptions extends TxOptions {
  status: TxStatus;
  events: Record<string, number>;
}
export interface TransactionsQueue {
  [id: number]: QueuedTxOptions | undefined;
}

export interface TransactionsState {
  txs: TransactionsQueue;
  process: (_: number) => Promise<void>;
  queue: (_: TxOptions) => number;
  dismiss: (id: number) => void;
}

export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

export type Account = Flatten<Awaited<ReturnType<typeof keyring.getAccounts>>>;
