// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Error } from './error';

export function AccountsError() {
  return (
    <Error>
      <div>No accounts found.</div>
      <p className="mb-3">
        1. Follow{' '}
        <a
          href="https://support.polkadot.network/support/solutions/articles/65000098878-how-to-create-a-dot-account"
          rel="noopener noreferrer"
          target="_blank"
        >
          this guide
        </a>{' '}
        to create your first account in the Polkadot.js extension.
      </p>
      <p className="mb-3">
        2. Drip some funds into your account via the faucets of our supported networks. You can find
        a faucets list{' '}
        <a href="https://github.com/paritytech/contracts-ui/blob/master/FAUCETS.md">here</a>.
      </p>
    </Error>
  );
}

export function ExtensionError() {
  return (
    <Error>
      <div>No signer extension found.</div>
      <div className="flex flex-col items-center text-center">
        <b>New to Substrate?</b>
        <p className="mb-3">
          Install the a compatible wallet like{' '}
          <a href="https://polkadot.js.org/extension/" rel="noopener noreferrer" target="_blank">
            Polkadot.js Extension
          </a>{' '}
          to create and manage Substrate accounts.
        </p>
        <p className="mb-3">
          You can find out more about compatible wallets on the{' '}
          <a href="https://wiki.polkadot.network/docs/wallets">Polkadot documentation</a> about
          wallets.
        </p>
        <p>
          If the extension is installed and you are seeing this, make sure it allows{' '}
          <span className="whitespace-nowrap">Contracts UI </span> to use your accounts for signing.
        </p>
      </div>
    </Error>
  );
}
