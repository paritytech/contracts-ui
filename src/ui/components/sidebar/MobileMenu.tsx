// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MenuIcon, ShareIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { NetworkAndUser } from './NetworkAndUser';
import { QuickLinks } from './QuickLinks';

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
    <div className="dark:bg-elevation-1">
      <div className="mobilemenu flex w-screen justify-center px-4 py-3 md:hidden">
        <button className="flex-none text-center w-8 h-8" onClick={toggleMainMenu}>
          <MenuIcon className="w-5 h-5 mx-auto text-gray-300" />
        </button>
        <div className="flex flex-1 justify-center items-center">
          <h1>Contracts UI</h1>
        </div>
        <button
          className="flex-none text-center w-8 h-8 border border-gray-700 rounded"
          onClick={toggleNetworkMenu}
        >
          <ShareIcon className="w-5 h-5 mx-auto text-gray-300" />
        </button>
      </div>
      {mainMenuOpen && (
        <>
          <hr className="border border-gray-700 mx-4" />
          <div className="px-4 py-3 space-y-4">
            <Navigation />
            <QuickLinks />
            <hr className="border border-gray-700" />
            <Footer />
          </div>
        </>
      )}
      {networkMenuOpen && (
        <>
          <hr className="border border-gray-700 mx-4" />
          <div className="px-4 py-3">
            <NetworkAndUser />
          </div>
        </>
      )}
    </div>
  );
}
