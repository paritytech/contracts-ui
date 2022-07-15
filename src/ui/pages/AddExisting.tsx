// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AddExistingForm } from 'ui/components/contract';
import { Page } from 'ui/templates';

export function AddExisting() {
  return (
    <Page
      header="Add Metadata to an Existing Contract Instance"
      help={
        <>
          You can locate a previously instantiated contract and link its metadata file to allow
          interaction in this browser.
        </>
      }
    >
      <AddExistingForm />
    </Page>
  );
}
