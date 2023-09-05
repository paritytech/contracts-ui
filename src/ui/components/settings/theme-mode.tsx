// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Dropdown } from 'ui/components/common/dropdown';
import { useTheme } from 'ui/contexts';

const options = [
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
];

export function ThemeMode() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="grid w-full grid-cols-12">
      <div className="col-span-6 flex flex-col text-sm lg:col-span-7 2xl:col-span-8">
        <span className="font-semibold">Theme mode</span>
        <span className="text-gray-500 dark:text-gray-400">Select a display theme</span>
      </div>
      <div className="col-span-6 lg:col-span-5 2xl:col-span-4">
        <Dropdown
          onChange={e => setTheme && setTheme(e as 'light' | 'dark')}
          options={options}
          value={theme}
        />
      </div>
    </div>
  );
}
