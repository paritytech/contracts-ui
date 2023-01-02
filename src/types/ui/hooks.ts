// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { VoidFn } from '../substrate';
import { BN, FileState, MetadataState, Validation } from './util';

export type InputMode = 'estimation' | 'custom';

export type UIGas = {
  isValid: boolean;
  setIsValid: (value: boolean) => void;
  limit: BN;
  setLimit: React.Dispatch<BN>;
  mode?: InputMode;
  setMode: (m: InputMode) => void;
  errorMsg: string;
  setErrorMsg: (m: string) => void;
  text: string;
  setText: (m: string) => void;
};

export interface ValidFormField<T> extends Validation {
  value: T;
  onChange: (_: T) => void;
}

export type UseBalance = ValidFormField<BN>;

export interface UseMetadata extends MetadataState {
  onChange: (_: FileState) => void;
  onRemove: () => void;
}

export type UseStepper = [number, VoidFn, VoidFn, React.Dispatch<number>];

export type UseToggle = [boolean, () => void, (value: boolean) => void];

export interface UseStorageDepositLimit extends ValidFormField<BN> {
  maximum: BN | undefined;
  isActive: boolean;
  toggleIsActive: () => void;
}
