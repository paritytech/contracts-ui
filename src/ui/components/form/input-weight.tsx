// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { Meter } from '../common/meter';
import { InputNumber } from './input-number';
import { UIGas } from 'types';
import { MAX_CALL_WEIGHT } from 'src/constants';

export function InputWeight({
  setLimit,
  mode,
  setMode,
  setErrorMsg,
  setIsValid,
  limit,
  name,
  text,
  setText,
}: UIGas & { name: string }) {
  return (
    <>
      <InputNumber
        className="disabled:opacity-60"
        data-cy="refTime-input"
        disabled={mode === 'estimation'}
        min="0"
        onChange={e => {
          if (mode === 'custom') {
            const bn = new BN(e.target.value);
            if (bn.lte(MAX_CALL_WEIGHT)) {
              if (!bn.eq(limit)) {
                setText(e.target.value);
                setLimit(bn);
                setErrorMsg('');
                setIsValid(true);
              }
            } else {
              setErrorMsg('Value exceeds maximum block weight');
              setIsValid(false);
            }
          }
        }}
        placeholder="MGas"
        value={text}
      />
      <Meter
        accessory={
          mode === 'custom' ? (
            <a
              className="text-green-500"
              data-cy={`use-estimated-${name}`}
              href="#"
              onClick={e => {
                e.preventDefault();
                setMode('estimation');
              }}
            >
              <span> {`Use Estimation`}</span>
            </a>
          ) : (
            <>
              <span> {`Using Estimation`}</span>
              &nbsp;{' · '}&nbsp;
              <a
                className="text-green-500"
                data-cy="use-custom-refTime"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setMode('custom');
                }}
              >
                Use Custom
              </a>
            </>
          )
        }
        withAccessory={true}
      />
    </>
  );
}
