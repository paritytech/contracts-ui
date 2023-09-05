// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Footer } from './footer';
import { MobileMenu } from './mobile-menu';
import { Navigation } from './navigation';
import { NetworkAndUser } from './network-and-user';
import { QuickLinks } from './quick-link';

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
