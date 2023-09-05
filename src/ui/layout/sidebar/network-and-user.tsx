// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';

import { MAINNETS, TESTNETS } from '../../../constants';
import { useApi } from 'ui/contexts';
import { classes } from 'lib/util';
import { Dropdown } from 'ui/components';

const testnetOptions = TESTNETS.map(network => ({
  label: network.name,
  value: network.rpc,
}));

const mainnetOptions = MAINNETS.map(network => ({
  label: network.name,
  value: network.rpc,
}));

const allOptions = [...testnetOptions, ...mainnetOptions];

const dropdownOptions = [
  {
    label: 'Live Networks',
    options: mainnetOptions,
  },
  {
    label: 'Test Networks',
    options: testnetOptions,
  },
];

export function NetworkAndUser() {
  const { endpoint, status } = useApi();
  const navigate = useNavigate();

  return (
    <div className="network-and-user">
      <Dropdown
        className={classes(
          'chain',
          status === 'connected' ? 'isConnected' : '',
          status === 'loading' ? 'isConnecting' : '',
          status === 'error' ? 'isError' : '',
        )}
        onChange={e => {
          navigate(`/?rpc=${e}`);
        }}
        options={dropdownOptions}
        value={allOptions.find(o => o.value === endpoint)?.value || allOptions[0].value}
      />
    </div>
  );
}
