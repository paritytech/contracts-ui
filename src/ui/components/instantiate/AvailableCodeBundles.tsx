// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FormField } from '../form/FormField';
import { CodeHash } from './CodeHash';
import { CodeBundleDocument } from 'types';
import { useApi, useDatabase } from 'ui/contexts';
import { filterOnChainCode } from 'api';
import { useDbQuery } from 'ui/hooks';

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
      {items.slice(0, (isExpanded ? 2 : 1) * PAGE_SIZE).map(codeBundle => {
        return (
          <CodeHash
            className="mb-2 last:mb-0"
            name={codeBundle.name}
            codeHash={codeBundle.codeHash}
            key={codeBundle.codeHash}
            onClick={() => navigate(`/add/instantiate/${codeBundle.codeHash}`)}
          />
        );
      })}
      {!isExpanded && items.length > PAGE_SIZE && (
        <a
          className="text-xs cursor-pointer dark:text-gray-500 dark:hover:text-gray-300"
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
  const [data, isLoading] = useDbQuery(() => db.codeBundles.limit(PAGE_SIZE).toArray(), [db]);
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
        <div className="text-sm py-4 text-center dark:text-gray-500">
          Or choose from a code hash below
        </div>
      )}
      <List items={codes} label="Uploaded Contract Code" />
    </>
  );
}
