// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from './api.context';
import { Database } from 'src/services/db';
import { DbState } from 'types';

export const DbContext: React.Context<DbState> = createContext({} as unknown as DbState);
export const DbConsumer: React.Consumer<DbState> = DbContext.Consumer;
export const DbProvider: React.Provider<DbState> = DbContext.Provider;

const INITIAL = {} as unknown as DbState;

export function DatabaseContextProvider({
  children,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { genesisHash } = useApi();
  const [state, setState] = useState<DbState>(INITIAL);

  useEffect((): void => {
    setState({
      db: new Database(genesisHash),
    });
  }, [genesisHash]);

  return <DbContext.Provider value={state}>{children}</DbContext.Provider>;
}

export function useDatabase(): DbState {
  return useContext(DbContext);
}
