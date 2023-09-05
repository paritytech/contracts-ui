// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DocumentAddIcon, CollectionIcon } from '@heroicons/react/outline';
import { NavLink } from './nav-link';

export function Navigation() {
  return (
    <div className="navigation">
      <NavLink icon={DocumentAddIcon} to={`/add-contract`}>
        Add New Contract
      </NavLink>
      <NavLink end icon={CollectionIcon} to={`/`}>
        All Contracts
      </NavLink>
    </div>
  );
}
