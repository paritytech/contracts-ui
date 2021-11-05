// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Dropdown } from '../common/Dropdown';
import { useDatabase, useApi } from 'ui/contexts';
import { classes } from 'ui/util';

const options = [
  {
    name: 'Local Node',
    value: 'ws://127.0.0.1:9944',
  },
];

export function NetworkAndUser() {
  const { endpoint, status } = useApi();
  const { user } = useDatabase();
  const [chain] = useState(endpoint);

  return (
    <div className="network-and-user">
      <Dropdown
        className={classes(
          'chain',
          status === 'READY' ? 'isConnected' : '',
          status === 'CONNECTING' ? 'isConnecting' : '',
          status === 'ERROR' ? 'isError' : ''
        )}
        onChange={() => {}}
        options={options}
        value={chain}
      />
      {!user?.creator && (
        <Button className="connect-account" variant="primary">
          Connect Account
        </Button>
      )}
    </div>
  );
}
