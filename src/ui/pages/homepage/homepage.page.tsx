// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Contracts, HelpBox, Statistics } from '../../components/homepage';
import { RootLayout } from 'ui/layout';

export function Homepage() {
  return (
    <RootLayout
      aside={
        <>
          <HelpBox />
          <Statistics />
        </>
      }
      heading="Contracts"
    >
      <Contracts />
    </RootLayout>
  );
}
