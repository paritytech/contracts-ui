// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useApi } from 'ui/contexts/api.context';
import { Abi, ApiPromise, FileState, MetadataState, UseMetadata, Validation, VoidFn } from 'types';

type OnChange = (_: FileState | undefined, __?: Record<string, unknown>) => void;
type OnRemove = VoidFn;

interface Options {
  isWasmRequired?: boolean;
  revertOnFileRemove?: boolean;
}

interface DeriveOptions extends Options {
  name?: string;
}

interface Callbacks {
  onChange?: OnChange;
  onRemove?: OnRemove;
}

function deriveFromJson(
  options: DeriveOptions,
  source?: Record<string, unknown>,
  api?: ApiPromise | null,
): MetadataState {
  if (!source) {
    return EMPTY;
  }

  let value: Abi | undefined = undefined;

  try {
    value = new Abi(source, api?.registry.getChainProperties());

    const name = options.name || value.info.contract.name.toString();

    return {
      source,
      name,
      value,
      isSupplied: true,
      ...validate(value, options),
    };
  } catch (e) {
    console.error(e);

    return {
      source,
      name: '',
      value,
      isSupplied: true,
      ...validate(value, options),
    };
  }
}

const EMPTY: MetadataState = {
  isError: false,
  isSupplied: false,
  isValid: false,
  name: '',
  message: null,
};

function validate(metadata: Abi | undefined, { isWasmRequired }: Options): Validation {
  if (!metadata) {
    return {
      isValid: false,
      isError: true,
      message:
        'Invalid contract file format. Please upload the generated .contract bundle for your smart contract.',
    };
  }

  return {
    isValid: true,
    isError: false,
    isSuccess: true,
    message: isWasmRequired ? 'Valid contract bundle!' : 'Valid metadata file!',
  };
}

const utf8decoder = new TextDecoder();

export function useMetadata(
  initialValue?: Record<string, unknown>,
  options: Options & Callbacks = {},
): UseMetadata {
  const { api } = useApi();

  const { isWasmRequired = false, revertOnFileRemove = false, ...callbacks } = options;
  const [state, setState] = useState<MetadataState>(() =>
    deriveFromJson({ isWasmRequired }, initialValue, api),
  );

  function onChange(file: FileState): void {
    try {
      const json = JSON.parse(utf8decoder.decode(file.data)) as Record<string, unknown>;
      const name = file.name.replace('.contract', '').replace('.json', '').replace('_', ' ');

      const newState = deriveFromJson({ isWasmRequired, name }, json, api);

      setState(newState);

      callbacks.onChange && callbacks.onChange(file, json);
    } catch (error) {
      console.error(error);

      setState({
        ...EMPTY,
        message: 'This contract file is not in a valid format.',
        isError: true,
        isSupplied: true,
        isValid: false,
      });
    }
  }

  function onRemove(): void {
    const newState = options.revertOnFileRemove
      ? deriveFromJson({ isWasmRequired }, initialValue, api)
      : EMPTY;

    setState(newState);

    callbacks.onChange && callbacks.onChange(undefined);
    callbacks.onRemove && callbacks.onRemove();
  }

  useEffect((): void => {
    setState(deriveFromJson({ isWasmRequired }, initialValue, api));
  }, [api, initialValue, isWasmRequired]);

  return {
    ...state,
    onChange,
    onRemove,
  };
}
