// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MenuIcon, ShareIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { Footer } from './footer';
import { Navigation } from './navigation';
import { NetworkAndUser } from './network-and-user';
import { QuickLinks } from './quick-link';

export function MobileMenu() {
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  const toggleMainMenu = () => {
    setNetworkMenuOpen(false);
    mainMenuOpen === false ? setMainMenuOpen(true) : setMainMenuOpen(false);
  };

  const toggleNetworkMenu = () => {
    setMainMenuOpen(false);
    networkMenuOpen === false ? setNetworkMenuOpen(true) : setNetworkMenuOpen(false);
  };

  return (
    <div className="dark:bg-elevation-1 md:hidden">
      <div className="mobilemenu flex w-screen justify-center px-4 py-3">
        <button className="h-8 w-8 flex-none text-center" onClick={toggleMainMenu}>
          <MenuIcon className="mx-auto h-7 w-7 text-gray-300" />
        </button>
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-lg font-medium">Contracts UI</h1>
        </div>
        <button
          className="h-8 w-8 flex-none rounded border border-gray-700 text-center"
          onClick={toggleNetworkMenu}
        >
          <ShareIcon className="mx-auto h-5 w-5 text-gray-300" />
        </button>
      </div>
      {mainMenuOpen && (
        <>
          <hr className="mx-4 border border-gray-700" />
          <div className="space-y-4 px-4 py-3">
            <Navigation />
            <QuickLinks />
            <hr className="border border-gray-700" />
            <Footer />
          </div>
        </>
      )}
      {networkMenuOpen && (
        <>
          <hr className="mx-4 border border-gray-700" />
          <div className="px-4 py-3">
            <NetworkAndUser />
          </div>
        </>
      )}
    </div>
  );
}
