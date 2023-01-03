// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  beforeAllContracts,
  assertUpload,
  assertMoveToStep2,
  assertMoveToStep3,
  assertContractRedirect,
  assertInstantiate,
  assertCall,
  assertReturnValue,
  selectMessage,
} from '../../support/util';

describe('ERC20 Contract ', () => {
  const initialSupply = 77;
  const transferValue = 2;
  const allowance = 2;

  before(() => {
    beforeAllContracts();
  });

  it('contract file uploads', () => {
    assertUpload('erc20.contract');
  });

  it('moves to step 2', () => {
    assertMoveToStep2();
  });

  it(`types ${initialSupply} in the totalSupply field`, () => {
    cy.get('.form-field.totalSupply').find('input[type="number"]').eq(0).type(`${initialSupply}`);
    cy.get('[data-cy="next-btn"]').should('not.be.disabled');
  });

  it('moves to step 3', () => {
    assertMoveToStep3();
  });

  it('submits instantiate transaction', () => {
    assertInstantiate();
  });

  it('redirects to contract page after instantiation', () => {
    assertContractRedirect();
  });

  it(`calling totalSupply() returns ${initialSupply}`, () => {
    assertReturnValue('totalSupply', `${initialSupply}`);
  });

  it(`transfers ${transferValue} Units to another account`, () => {
    selectMessage('transfer', 3);
    cy.get('.form-field.to').find('.dropdown').click().find('.dropdown__option').eq(3).click();
    cy.get('.form-field.value').find('input[type="number"]').eq(0).type(`${transferValue}`);
    assertCall();
    selectMessage('balanceOf', 1);
    assertReturnValue('balanceOf', `${initialSupply - transferValue}`);
  });

  it(`successfully approves allowance`, () => {
    selectMessage('approve', 4);
    cy.get('.form-field.spender').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    cy.get('.form-field.value').find('input[type="number"]').type(`${allowance}`);
    assertCall();
    selectMessage('allowance', 2);
    cy.get('.form-field.spender').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    assertReturnValue('allowance', `${allowance}`);
  });

  it(`transfers ${transferValue} on behalf of alice`, () => {
    cy.get('.form-field.caller').click().find('.dropdown__option').eq(2).click();
    selectMessage('transferFrom', 5);
    cy.get('.form-field.to').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    cy.get('.form-field.value').find('input[type="number"]').type(`${transferValue}`);
    assertCall();
    selectMessage('balanceOf', 1);
    cy.get('.form-field.owner').find('.dropdown').click().find('.dropdown__option').eq(2).click();
    assertReturnValue('balanceOf', `${transferValue}`);
  });
});
