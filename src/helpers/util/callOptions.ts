// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BN_ZERO } from './bn';
import { randomAsU8a } from './util';
import { UIStorageDeposit, ContractCallOutcome, BN, WeightV2, AbiParam, Registry } from 'types';

export function decodeStorageDeposit(
  storageDeposit: ContractCallOutcome['storageDeposit']
): UIStorageDeposit {
  if (storageDeposit.isCharge) {
    return { value: storageDeposit.asCharge, type: 'charge' };
  } else if (storageDeposit.isRefund) {
    return { value: storageDeposit.asRefund, type: 'refund' };
  }
  return {
    type: 'empty',
  };
}

export function getPredictedCharge(dryRun: UIStorageDeposit) {
  return dryRun?.type === 'charge'
    ? !dryRun.value?.eq(BN_ZERO)
      ? dryRun.value
      : undefined
    : undefined;
}

export function getStorageDepositLimit(
  switchOn: boolean,
  userInput: BN,
  dryRun?: UIStorageDeposit
) {
  return switchOn ? userInput : dryRun && getPredictedCharge(dryRun);
}

export function getGasLimit(
  switchOn: boolean,
  refTimeLimit: BN,
  proofSizeLimit: BN,
  registry: Registry
): WeightV2 | null {
  return switchOn
    ? registry.createType('WeightV2', {
        refTime: refTimeLimit,
        proofSize: proofSizeLimit,
      })
    : null;
}

export function transformUserInput(
  registry: Registry,
  messageArgs: AbiParam[],
  values?: Record<string, unknown>
): unknown[] {
  return messageArgs.map(({ name, type: { type } }) => {
    const value = values ? values[name] : null;

    if (type === 'Balance') {
      return registry.createType('Balance', value);
    }

    return value || null;
  });
}
const encoder = new TextEncoder();

export function encodeSalt(salt: Uint8Array | string = randomAsU8a()): Uint8Array {
  if (typeof salt === 'string') return encoder.encode(salt);
  return salt;
}
