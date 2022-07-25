// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

interface Window {
  injectedWeb3: any;
}

describe('Signer extension flow on live networks', () => {
  before(() => {
    cy.visit(`/instantiate/?rpc=wss://rococo-contracts-rpc.polkadot.io`);
  });
  it('connects to Rococo', () => {
    cy.contains('Connecting to wss://rococo-contracts-rpc.polkadot.io').should('not.exist', {
      timeout: 25000,
    });
  });

  it('Rococo is selected in the network connection dropdown', () => {
    cy.get('.dropdown.chain')
      .find('.dropdown__single-value')
      .should('contain', 'Contracts (Rococo)');
  });

  it('Displays help text for no extension installed', () => {
    cy.get('[data-cy="error-card"]').within(() => {
      cy.contains('No signer extension found.').should('be.visible');
      cy.contains('New to Substrate?').should('be.visible');
      cy.contains(
        'Install the Polkadot.js Extension to create and manage Substrate accounts.'
      ).should('be.visible');
      cy.contains(
        'If the extension is installed and you are seeing this, make sure it allows Contracts UI to use your accounts for signing.'
      ).should('be.visible');
    });
  });
  it('Displays help text for no accounts found', () => {
    cy.visit('/').then(window => {
      window.injectedWeb3 = {
        'polkadot-js': {
          version: '123',
          enable: () => Promise.resolve({ accounts: [] }),
        },
      };
    });
    cy.get('[data-cy="error-card"]').within(() => {
      cy.contains('No accounts found.').should('be.visible');
      cy.contains(
        '1. Follow this guide to create your first account in the Polkadot.js extension.'
      ).should('be.visible');
      cy.contains(
        '2. Drip some funds into your account via the faucets of our supported networks.'
      ).should('be.visible');
      cy.contains('Contracts on Rococo').should('be.visible');
      cy.contains('Shiden / Shibuya').should('be.visible');
    });
  });
});
