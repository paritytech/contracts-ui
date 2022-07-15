// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { XCircleIcon } from '@heroicons/react/outline';
import { Input } from '../form/Input';
import { FormField } from '../form/FormField';
import { SearchResults } from '../common/SearchResults';
import { CodeHash } from './CodeHash';
import { classes, isValidCodeHash } from 'ui/util';
import { checkOnChainCode, filterOnChainCode } from 'api';
import { useApi, useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function LookUpCodeHash() {
  const navigate = useNavigate();
  const { api } = useApi();
  const { db } = useDatabase();
  const [searchString, setSearchString] = useState('');
  const [codeHash, setCodeHash] = useState('');

  const [searchResults] = useDbQuery(async () => {
    const matches = await db.codeBundles
      .filter(({ name, codeHash }) => {
        const regex = new RegExp(searchString);

        return regex.test(name) || regex.test(codeHash);
      })
      .limit(10)
      .toArray();

    return filterOnChainCode(api, matches);
  }, [api, db, searchString]);
  const [codeBundle] = useDbQuery(() => db.codeBundles.get({ codeHash }), [codeHash, db]);

  useEffect((): void => {
    if (codeHash !== searchString) {
      if (searchString === '' || isValidCodeHash(searchString)) {
        checkOnChainCode(api, searchString)
          .then(isOnChain => (isOnChain ? setCodeHash(searchString) : setCodeHash('')))
          .catch(console.error);
      } else {
        setCodeHash('');
      }
    }
  }, [api, codeHash, searchString]);

  useEffect((): void => {
    codeHash && setSearchString(codeHash);
  }, [codeHash]);

  return (
    <FormField className="h-36 relative" label="Look Up Code Hash">
      <Input
        className={classes('relative flex items-center')}
        onChange={setSearchString}
        placeholder="Paste a code hash or search for existing code bundles already on-chain"
        value={searchString}
      >
        {codeBundle && (
          <button className="absolute right-2" onClick={() => setSearchString('')}>
            <XCircleIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        )}
      </Input>
      <SearchResults
        codeBundles={searchResults}
        isOpen={!codeHash && searchString.length > 0}
        onSelectCodeBundle={document => {
          setCodeHash(document.codeHash);
        }}
      />
      {codeHash && !!codeBundle && (
        <CodeHash
          className="mt-1"
          codeHash={codeHash}
          isSuccess
          name={codeBundle?.name || 'On-chain Code Exists'}
          onClick={() => navigate(`/add/instantiate/${codeHash}`)}
        />
      )}
    </FormField>
  );
}
