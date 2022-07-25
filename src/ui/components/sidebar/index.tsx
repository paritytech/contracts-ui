// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';
import { NetworkAndUser } from './NetworkAndUser';
import { QuickLinks } from './QuickLinks';

export function Sidebar() {
  return (
    <>
      <div className="sidebar hidden md:flex">
        <div className="sidebar-inner">
          <div className="upper">
            <nav aria-label="Sidebar">
              <NetworkAndUser />
              <Navigation />
              <QuickLinks />
            </nav>
          </div>
          <Footer />
        </div>
      </div>
      <MobileMenu />
    </>
  );
}
