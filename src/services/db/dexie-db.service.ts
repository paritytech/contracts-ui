// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Dexie, { Table } from 'dexie';

export interface CodeBundleDocument {
  abi: Record<string, unknown>;
  codeHash: string;
  date: string;
  id?: number;
  name: string;
}

export interface ContractDocument extends CodeBundleDocument {
  abi: Record<string, unknown>;
  address: string;
  external?: boolean;
}

export class Database extends Dexie {
  codeBundles!: Table<CodeBundleDocument, number>;
  contracts!: Table<ContractDocument, number>;

  constructor(genesisHash: string) {
    super(`contracts-ui__${genesisHash}`);

    this.version(1).stores({
      codeBundles: '++id, codeHash, name, date',
      contracts: '++id, address, codeHash, name, date',
    });
  }
}
