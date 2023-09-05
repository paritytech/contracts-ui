// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ContractHeader } from '../contract-header/contract-header.page';

import { MetadataTab } from './metadata-tab';
import { InteractTab } from './interact';
import { Loader } from 'ui/shared/loader';
import { Tabs } from 'ui/shared/tabs';

import { RootLayout } from 'ui/layout';
import { useStoredContract } from 'ui/hooks';
import { HeaderButtons } from './header-buttons';

const TABS = [
  {
    id: 'metadata',
    label: (
      <>
        <BookOpenIcon />
        Metadata
      </>
    ),
  },
  {
    id: 'interact',
    label: (
      <>
        <PlayIcon />
        Interact
      </>
    ),
  },
];

export function Contract() {
  const [tabIndex, setTabIndex] = useState(1);
  const { address } = useParams();
  if (!address) throw new Error('No address in url');
  const contract = useStoredContract(address);

  return (
    <Loader isLoading={!contract} message="Loading contract...">
      {contract && (
        <RootLayout
          accessory={<HeaderButtons contract={contract} />}
          heading={contract.displayName || contract.name}
          help={<ContractHeader document={contract} />}
        >
          <Tabs index={tabIndex} setIndex={setTabIndex} tabs={TABS}>
            <MetadataTab abi={contract.abi} id={contract.id} />
            <InteractTab contract={contract} />
          </Tabs>
        </RootLayout>
      )}
    </Loader>
  );
}
