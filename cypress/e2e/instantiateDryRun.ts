// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
import { beforeAllContracts, assertUpload, assertMoveToStep2 } from '../support/util';

describe('Instantiate dry run', () => {
  before(() => {
    beforeAllContracts();
  });

  it('multisig contract uploads', () => {
    assertUpload('multisig.contract');
  });

  it('moves to step 2', () => {
    assertMoveToStep2();
  });

  it('displays dry run error and debug message', () => {
    // initial multisig dry run is expected to return an error because requirement input value = 0
    cy.get('[data-cy="dry-run-result"]').within(() => {
      cy.contains('ContractTrapped').should('be.visible');
      cy.contains('Contract trapped during execution.').should('be.visible');
      cy.contains(
        "panicked at 'assertion failed: 0 < requirement && requirement <= owners && owners <= MAX_OWNERS"
      ).should('be.visible');
    });
  });

  it('next button is disabled', () => {
    cy.get('[data-cy="next-btn"]').should('be.disabled');
  });

  it('displays dry run estimations after adjusting <requirement> ', () => {
    cy.get('.form-field.requirement').find('input[type="number"]').type('1');
    cy.get('[data-cy="dry-run-result"]').within(() => {
      cy.contains('The instantiation will be successful.').should('be.visible');
      cy.get('[data-cy="estimated-storage-deposit"]')
        .should('not.contain', 'None')
        .and('not.be.empty');
      cy.get('[data-cy="estimated-gas"]').should('not.contain', 'None').and('not.be.empty');
      cy.get('[data-cy="dry-run-account"]')
        .find('[data-cy="identicon"]')
        .should('have.lengthOf', 1);
    });
    cy.get('[data-cy="account-address"]').should('not.be.empty').and('contain', '...');
  });
});
