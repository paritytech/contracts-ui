// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage, AnyJson, ContractExecResult, Registry, TypeDef } from 'types';

type ContractResultErr = {
  Err: AnyJson;
};

interface ContractResultOk {
  Ok: AnyJson;
}

function isErr(o: ContractResultErr | ContractResultOk | AnyJson): o is ContractResultErr {
  return typeof o === 'object' && o !== null && 'Err' in o;
}

function isOk(o: ContractResultErr | ContractResultOk | AnyJson): o is ContractResultOk {
  return typeof o === 'object' && o !== null && 'Ok' in o;
}

function getReturnTypeName(type: TypeDef | null | undefined) {
  return type?.lookupName || type?.type || '';
}

export function getDecodedOutput(
  { result }: Pick<ContractExecResult, 'result' | 'debugMessage'>,
  { returnType }: AbiMessage,
  registry: Registry
): {
  decodedOutput: string;
  isError: boolean;
} {
  let decodedOutput = '';
  let isError = true;
  if (result.isOk) {
    const flags = result.asOk.flags.toHuman();
    isError = flags.includes('Revert');
    const returnTypeName = getReturnTypeName(returnType);
    const r = returnType
      ? registry.createTypeUnsafe(returnTypeName, [result.asOk.data]).toHuman()
      : '()';
    const o = isOk(r) ? r.Ok : isErr(r) ? r.Err : r;

    const errorText = isErr(o)
      ? typeof o.Err === 'object'
        ? JSON.stringify(o.Err, null, 2)
        : o.Err?.toString() ?? 'Error'
      : o !== 'Ok'
      ? o?.toString() || 'Error'
      : 'Error';

    const okText = isOk(r)
      ? typeof o === 'object'
        ? JSON.stringify(o, null, '\t')
        : o?.toString() ?? '()'
      : JSON.stringify(o, null, '\t') ?? '()';

    decodedOutput = isError ? errorText : okText;
  }
  return {
    decodedOutput,
    isError,
  };
}
