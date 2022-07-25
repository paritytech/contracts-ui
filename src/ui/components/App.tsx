// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Outlet } from 'react-router';
import { Sidebar, AwaitApis } from 'ui/components';
import {
  ApiContextProvider,
  DatabaseContextProvider,
  TransactionsContextProvider,
  ThemeContextProvider,
} from 'ui/contexts';

const App = (): JSX.Element => {
  return (
    <ThemeContextProvider>
      <ApiContextProvider>
        <DatabaseContextProvider>
          <TransactionsContextProvider>
            <div className="relative flex-col md:flex-row md:fixed flex min-h-screen inset-0 overflow-hidden dark:bg-gray-900 dark:text-white text-black">
              <Sidebar />
              <AwaitApis>
                <Outlet />
              </AwaitApis>
            </div>
          </TransactionsContextProvider>
        </DatabaseContextProvider>
      </ApiContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
