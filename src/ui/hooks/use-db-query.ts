// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { OrFalsy } from 'types';

export function useDbQuery<T>(
  querier: () => T | Promise<T>,
  deps: unknown[] = [],
): [OrFalsy<T>, boolean] {
  const liveQuery = useLiveQuery<T, null>(querier, deps, null);
  const isLoading = useMemo(() => liveQuery === null, [liveQuery]);

  return [liveQuery, isLoading];
}
