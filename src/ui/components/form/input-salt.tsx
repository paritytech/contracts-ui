// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from '../common/switch';
import { Input } from './input';
import { SimpleSpread, ValidFormField } from 'types';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  ValidFormField<string> & {
    isActive?: boolean;
    toggleIsActive: () => void;
  }
>;

export function InputSalt({ isError, onChange, value, isActive = false, toggleIsActive }: Props) {
  return (
    <div className="flex items-center">
      <Input
        className="flex-1"
        id="salt"
        isDisabled={!isActive}
        isError={isError}
        onChange={onChange}
        placeholder={isActive ? '0x' : 'Do not use'}
        value={isActive ? value : ''}
      />
      <div className="flex w-18 items-center justify-center">
        <Switch onChange={toggleIsActive} value={isActive} />
      </div>
    </div>
  );
}
