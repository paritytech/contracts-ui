// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useRef, useState } from 'react';
import { useApi } from 'ui/contexts/ApiContext';
import { AbiMessage, AbiParam, Account, Registry, SetState } from 'types';
import { getInitValue, transformUserInput } from 'helpers';

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
  registry: Registry | undefined
): [ArgValues, SetState<ArgValues>, Uint8Array | undefined] {
  const { accounts } = useApi();
  const [value, setValue] = useState<ArgValues>(
    accounts && registry && message ? fromArgs(registry, accounts, message.args) : {}
  );
  const argsRef = useRef(message?.args ?? []);

  const inputData = useMemo(() => {
    return registry && message?.toU8a(transformUserInput(registry, message.args, value));
  }, [value, registry, message]);

  useEffect((): void => {
    if (accounts && message && argsRef.current !== message.args) {
      registry && setValue(fromArgs(registry, accounts, message.args));
      argsRef.current = message.args;
    }
  }, [accounts, message, registry]);

  return [value, setValue, inputData];
}
