// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DocumentTextIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { NavLink } from './nav-link';
import { useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function QuickLinks() {
  const { db } = useDatabase();
  const [contracts] = useDbQuery(() => db?.contracts.toArray() || Promise.resolve(null), [db]);

  return (
    <div className="quick-links">
      <div className="section your-contracts">
        <div className="header text-gray-400">Your Contracts</div>
        {contracts && contracts.length > 0 ? (
          contracts.map(({ name, address }) => {
            return (
              <NavLink icon={DocumentTextIcon} key={address} to={`/contract/${address}`}>
                {name}
              </NavLink>
            );
          })
        ) : (
          <div className="none-yet text-gray-400">
            None yet&nbsp;
            {' • '}&nbsp;
            <Link className="text-blue-400" to={`/instantiate`}>
              Upload one
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
