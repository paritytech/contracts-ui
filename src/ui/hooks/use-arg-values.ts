// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useRef, useState } from 'react';
import { useApi } from 'ui/contexts/api.context';
import { AbiMessage, AbiParam, Account, Registry, SetState } from 'types';
import { getInitValue } from 'lib/init-value';
import { transformUserInput } from 'lib/call-options';

type ArgValues = Record<string, unknown>;

function fromArgs(registry: Registry, accounts: Account[], args: AbiParam[]): ArgValues {
  const result: ArgValues = {};

  args?.forEach(({ name, type }) => {
    result[name] = getInitValue(registry, accounts, type);
  });

  return result;
}

export function useArgValues(
  message: AbiMessage | undefined,
  registry: Registry,
): [ArgValues, SetState<ArgValues>, Uint8Array | undefined] {
  const { accounts } = useApi();
  const [value, setValue] = useState<ArgValues>(
    accounts && message ? fromArgs(registry, accounts, message.args) : {},
  );
  const argsRef = useRef(message?.args ?? []);

  const inputData = useMemo(() => {
    let data: Uint8Array | undefined;
    try {
      data = message?.toU8a(transformUserInput(registry, message.args, value));
    } catch (e) {
      console.error(e);
    }
    return data;
  }, [value, registry, message]);

  useEffect((): void => {
    if (accounts && message && argsRef.current !== message.args) {
      setValue(fromArgs(registry, accounts, message.args));
      argsRef.current = message.args;
    }
  }, [accounts, message, registry]);

  return [value, setValue, inputData];
}
