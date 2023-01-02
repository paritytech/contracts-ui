// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { keyring } from '@polkadot/ui-keyring';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { twMerge } from 'tailwind-merge';
import { BN_TEN } from './bn';
import { ApiPromise, CodeBundleDocument } from 'types';

export function classes(...classLists: (string | null | undefined | false)[]) {
  return twMerge(...classLists.map(classList => (!classList ? null : classList)));
}

export function truncate(value: string | undefined, sideLength = 6): string {
  return value
    ? value.length > sideLength * 2
      ? `${value.substring(0, sideLength)}...${value.substring(value.length - sideLength)}`
      : value
    : '';
}

export function displayDate(isoDateString: string, formatString = 'd MMM'): string {
  return format(parseISO(isoDateString), formatString);
}

export function isValidCodeHash(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

export function isEmptyObj(value: unknown) {
  return JSON.stringify(value) === '{}';
}
export function randomAsU8a(length = 32) {
  return crypto.getRandomValues(new Uint8Array(length));
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

export async function getContractInfo(api: ApiPromise, address: string) {
  if (isValidAddress(address)) {
    return (await api.query.contracts.contractInfoOf(address)).unwrapOr(null);
  }
}

export async function checkOnChainCode(api: ApiPromise, codeHash: string): Promise<boolean> {
  return isValidCodeHash(codeHash)
    ? (await api.query.contracts.codeStorage(codeHash)).isSome
    : false;
}

export async function filterOnChainCode(api: ApiPromise, items: CodeBundleDocument[]) {
  const codes: CodeBundleDocument[] = [];
  for (const item of items) {
    const isOnChain = await checkOnChainCode(api, item.codeHash);
    isOnChain && codes.push(item);
  }
  return codes;
}

export const genRanHex: (size?: number) => `0x${string}` = (size = 32) =>
  `0x${[...Array<string>(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function printBN(num: number | BN | bigint) {
  return new Intl.NumberFormat('en-US').format(num as bigint);
}

export function isValidAddress(addr: unknown) {
  if (typeof addr === 'string') {
    return /^[0-9a-zA-Z]{48}/.test(addr);
  }
  return false;
}
