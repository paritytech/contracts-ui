// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useState, useContext } from 'react';
import {
  InstantiateProps,
  InstantiateState,
  CodeSubmittableResult,
  BlueprintSubmittableResult,
  InstantiateData,
  ContractInstantiateResult,
} from 'types';

const InstantiateContext = createContext<InstantiateState | undefined>(undefined);

export function isResultValid({
  contract,
}: CodeSubmittableResult<'promise'> | BlueprintSubmittableResult<'promise'>): boolean {
  return !!contract;
}

export function InstantiateContextProvider({
  children,
}: React.PropsWithChildren<Partial<InstantiateProps>>) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<InstantiateData>({} as InstantiateData);
  const [dryRunResult, setDryRunResult] = useState<ContractInstantiateResult>();

  const value: InstantiateState = {
    data,
    setData,
    step,
    setStep,
    dryRunResult,
    setDryRunResult,
  };

  return <InstantiateContext.Provider value={value}>{children}</InstantiateContext.Provider>;
}

export const useInstantiate = () => {
  const context = useContext(InstantiateContext);
  if (context === undefined) {
    throw new Error('useInstantiate must be used within an InstantiateProvider');
  }
  return context;
};
