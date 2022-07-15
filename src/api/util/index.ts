// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { compactAddLength, u8aToU8a, isNumber, BN_TEN } from '@polkadot/util';
import { randomAsU8a } from '@polkadot/util-crypto';
import { MAX_CALL_WEIGHT } from '../../constants';
import {
  Bytes,
  ApiPromise,
  AbiParam,
  Registry,
  OrFalsy,
  Weight,
  ChainType,
  SubmittableResult,
  Hash,
  CodeBundleDocument,
} from 'types';
import { isValidCodeHash } from 'ui/util';

const EMPTY_SALT = new Uint8Array();

export function maximumBlockWeight(api: OrFalsy<ApiPromise>): Weight {
  return api?.consts.system.blockWeights
    ? api.consts.system.blockWeights.maxBlock
    : (api?.consts.system.maximumBlockWeight as Weight) || MAX_CALL_WEIGHT;
}

export function encodeSalt(salt: Uint8Array | string | null = randomAsU8a()): Uint8Array {
  return salt instanceof Bytes
    ? salt
    : salt && salt.length
    ? compactAddLength(u8aToU8a(salt))
    : EMPTY_SALT;
}

export const NOOP = (): void => undefined;

export function fromBalance(value: BN | number | string | null): string {
  if (!value) {
    return '';
  }

  return value.toString();
}

export function toBalance(api: ApiPromise, value: string | number): BN {
  const asString = isNumber(value) ? value.toString() : value;
  const siPower = new BN(api.registry.chainDecimals[0]);

  const isDecimalValue = /^(\d+)\.(\d+)$/.exec(asString);

  if (isDecimalValue) {
    const div = new BN(asString.replace(/\.\d*$/, ''));
    const modString = asString.replace(/^\d+\./, '').substr(0, api.registry.chainDecimals[0]);
    const mod = new BN(modString);

    return div
      .mul(BN_TEN.pow(siPower))
      .add(mod.mul(BN_TEN.pow(new BN(siPower.subn(modString.length)))));
  } else {
    return new BN(asString.replace(/[^\d]/g, '')).mul(BN_TEN.pow(siPower));
  }
}

export function toSats(api: ApiPromise, balance: BN | number): BN {
  let bn: BN;

  if (isNumber(balance)) {
    bn = new BN(balance);
  } else {
    bn = balance;
  }

  return bn.mul(BN_TEN.pow(new BN(api.registry.chainDecimals[0])));
}

export function fromSats(api: ApiPromise, sats: BN): string {
  const pow = BN_TEN.pow(new BN(api.registry.chainDecimals[0]));
  const [div, mod] = [sats.div(pow), sats.mod(pow)];

  return `${div.toString()}${!mod.eqn(0) ? `.${mod.toString()}` : ''}`;
}

export function convertToNumber(value: string) {
  return value.includes('.') ? parseFloat(value) : parseInt(value);
}

export function transformUserInput(
  registry: Registry,
  messageArgs: AbiParam[],
  values?: Record<string, unknown>
) {
  return messageArgs.map(({ name, type: { type } }) => {
    const value = values ? values[name] : null;

    if (type === 'Balance') {
      return registry.createType('Balance', value);
    }

    return value || null;
  });
}

export function isValidWsUrl(s: unknown) {
  if (typeof s === 'string') {
    let url;
    try {
      url = new URL(s);
    } catch (_) {
      return false;
    }

    return url.protocol === 'ws:' || url.protocol === 'wss:';
  }
  return false;
}

export function isResultReady(result: SubmittableResult, systemChainType: ChainType): boolean {
  return systemChainType.isDevelopment ? result.isInBlock : result.isFinalized;
}

export function getBlockHash(
  status: SubmittableResult['status'],
  systemChainType: ChainType
): Hash {
  return systemChainType.isDevelopment ? status.asInBlock : status.asFinalized;
}

export async function getContractInfo(api: ApiPromise, address: string) {
  return (await api.query.contracts.contractInfoOf(address)).unwrapOr(null);
}

export async function checkOnChainCode(api: ApiPromise, codeHash: string): Promise<boolean> {
  return isValidCodeHash(codeHash)
    ? (await api.query.contracts.codeStorage(codeHash)).isSome
    : false;
}

export async function checkOnChainContract(api: ApiPromise, address: string): Promise<boolean> {
  const info = await api.query.contracts.contractInfoOf(address);

  return info.isSome;
}

export async function filterOnChainCode(api: ApiPromise, items: CodeBundleDocument[]) {
  const codes: CodeBundleDocument[] = [];
  for (const item of items) {
    const isOnChain = await checkOnChainCode(api, item.codeHash);
    isOnChain && codes.push(item);
  }
  return codes;
}
