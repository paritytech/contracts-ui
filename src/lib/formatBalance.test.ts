// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise } from '@polkadot/api';
import { describe, it, expect, test, beforeAll } from 'vitest';
import { formatBalance } from './formatBalance';

describe('formatBalance', () => {
  let api: ApiPromise;

  beforeAll(async () => {
    api = await ApiPromise.create({
      types: {
        Balance: 'u128',
      },
    });
  });

  it('should throw on invalid options', () => {
    expect(() => formatBalance(api.createType('Balance', 1), { decimals: -1, digits: 0 })).toThrow(
      'Decimals must be positive',
    );
    expect(() => formatBalance(api.createType('Balance', 1), { decimals: 0, digits: -1 })).toThrow(
      'Digits must be positive',
    );
    expect(() => formatBalance(api.createType('Balance', 1), { decimals: 0, digits: 1 })).toThrow(
      'Decimals must be greater than digits',
    );
  });

  it('should format edge cases correctly', () => {
    [
      { value: 0n, expected: '0.00' },
      { value: 1_000_000_000_000n, expected: '1.00' },
      // u128::MAX value
      {
        value: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
        expected: '340,282,366,920,938,463,463,374,607.43',
      },
    ].forEach(({ value, expected }) => {
      const balance = api.createType('Balance', value);
      expect(formatBalance(balance)).toBe(expected);
    });
  });

  it('edge cases with custom options', () => {
    [
      { value: 0n, expected: '0.0000', options: { decimals: 4, digits: 4 } },
      { value: 123456789n, expected: '1.23456789', options: { decimals: 8, digits: 8 } },
      {
        value: 1_123_456_789_101_112_134n,
        expected: '1.123456789101112134',
        options: { decimals: 18, digits: 18 },
      },
      {
        value: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
        expected: '3.40282366920938463463374607431768211455',
        options: { decimals: 38, digits: 38 },
      },
      {
        value: 340_282_366_920_938_463_463_374_607_431_768_211_455n,
        expected: '0.00000000000340282366920938463463374607',
        options: { decimals: 50, digits: 38 },
      },
    ].forEach(({ value, expected, options }) => {
      const balance = api.createType('Balance', value);
      expect(formatBalance(balance, options)).toBe(expected);
    });
  });
});
