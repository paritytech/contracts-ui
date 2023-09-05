// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FormField } from '../form/form-field';
import { CodeHash } from './code-hash';
import { CodeBundleDocument } from 'types';
import { useApi, useDatabase } from 'ui/contexts';

import { useDbQuery } from 'ui/hooks';
import { filterOnChainCode } from 'services/chain';

const PAGE_SIZE = 5;

interface ListProps {
  items: CodeBundleDocument[];
  label: React.ReactNode;
}

function List({ items, label }: ListProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) {
    return null;
  }

  return (
    <FormField label={label}>
      {items.slice(0, isExpanded ? undefined : PAGE_SIZE).map(codeBundle => {
        return (
          <CodeHash
            className="mb-2 last:mb-0"
            codeHash={codeBundle.codeHash}
            date={codeBundle.date}
            key={codeBundle.codeHash}
            name={codeBundle.name}
            onClick={() => navigate(`/instantiate/${codeBundle.codeHash}`)}
          />
        );
      })}
      {!isExpanded && items.length > PAGE_SIZE && (
        <a
          className="cursor-pointer text-xs dark:text-gray-500 dark:hover:text-gray-300"
          onClick={() => setIsExpanded(true)}
        >
          → Show More
        </a>
      )}
    </FormField>
  );
}

export function AvailableCodeBundles() {
  const { api } = useApi();
  const { db } = useDatabase();
  const [data, isLoading] = useDbQuery(
    () => db.codeBundles.orderBy('date').reverse().toArray(),
    [db],
  );
  const [codes, setCodes] = useState<CodeBundleDocument[]>([]);

  useEffect(() => {
    data &&
      filterOnChainCode(api, data)
        .then(codes => setCodes(codes))
        .catch(console.error);
  }, [api, data]);

  if (isLoading || !data || data.length === 0) {
    return null;
  }

  return (
    <>
      {codes.length > 0 && (
        <div className="py-4 text-center text-sm dark:text-gray-500">
          Or choose from a code hash below
        </div>
      )}
      <List items={codes} label="Uploaded Contract Code" />
    </>
  );
}
