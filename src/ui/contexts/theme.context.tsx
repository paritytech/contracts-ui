// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useEffect } from 'react';
import { LOCAL_STORAGE_KEY } from '../../constants';
import { useLocalStorage } from 'ui/hooks/use-local-storage';

type Theme = 'light' | 'dark';
type Props = {
  theme: Theme;
  setTheme?: (_: Theme) => void;
};

const INIT_STATE: Props = {
  theme:
    'theme' in localStorage
      ? localStorage.theme === 'dark'
        ? 'dark'
        : 'light'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
};

export const ThemeContext = createContext(INIT_STATE);

export const ThemeContextProvider = ({ children }: React.PropsWithChildren<Partial<Props>>) => {
  const [theme, setTheme] = useLocalStorage<Theme>(LOCAL_STORAGE_KEY.THEME, INIT_STATE.theme);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
