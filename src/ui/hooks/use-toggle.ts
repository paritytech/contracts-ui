// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useEffect, useState } from 'react';
import { useIsMounted } from './use-is-mounted';
import type { UseToggle } from 'types';

// Simple wrapper for a true/false toggle
export function useToggle(defaultValue = false, onToggle?: (isActive: boolean) => void): UseToggle {
  const isMounted = useIsMounted();
  const [isActive, setActive] = useState(defaultValue);

  const toggle = useCallback((): void => {
    setActive(isActive => !isActive);
  }, []);

  useEffect(() => {
    isMounted && !!onToggle && onToggle(isActive);
  }, [isMounted, isActive, onToggle]);

  return [isActive, toggle, setActive];
}
