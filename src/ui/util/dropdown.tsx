// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MessageSignature } from '../components/message/message-signature';
import {
  AbiConstructor,
  AbiMessage,
  DropdownOption,
  ContractDocument,
  Registry,
  Account,
} from 'types';

export function createConstructorOptions(
  registry: Registry,
  data?: AbiConstructor[],
): DropdownOption<number>[] {
  return (data || []).map((constructor, index) => ({
    label: <MessageSignature message={constructor} registry={registry} />,
    value: index,
  }));
}

export function createMessageOptions(
  registry: Registry,
  data?: AbiMessage[],
): DropdownOption<AbiMessage>[] {
  return (data || []).map(message => ({
    label: <MessageSignature message={message} registry={registry} />,
    value: message,
  }));
}

export function createAccountOptions(data: Account[]): DropdownOption<string>[] {
  return data.map(pair => ({
    label: pair.meta?.name as string,
    value: pair.address || '',
  }));
}

export function createContractOptions(data: ContractDocument[]): DropdownOption<string>[] {
  return data.map(({ name, address }) => ({
    label: name,
    value: address,
  }));
}
