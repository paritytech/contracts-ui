// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FileState, OrFalsy, UseMetadata } from 'types';
import { useMetadata } from 'ui/hooks/useMetadata';
import { useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

interface UseMetadataField extends UseMetadata {
  file: OrFalsy<FileState>;
  isLoading: boolean;
  isStored: boolean;
}

export const useMetadataField = (): UseMetadataField => {
  const navigate = useNavigate();
  const { db } = useDatabase();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  const [file, setFile] = useState<OrFalsy<FileState>>(null);

  const [codeBundle, isLoading] = useDbQuery(
    () => db.codeBundles.get({ codeHash: codeHashUrlParam || '' }),
    [codeHashUrlParam, db]
  );
  const metadata = useMetadata(codeBundle?.abi, {
    isWasmRequired: !codeBundle,
    onChange: setFile,
  });

  const isStored = useMemo((): boolean => !!codeBundle, [codeBundle]);

  useEffect((): void => {
    if (codeHashUrlParam && !codeBundle && !isLoading) {
      navigate(`/add/instantiate/${codeHashUrlParam}`);
    }
  }, [codeBundle, codeHashUrlParam, isLoading, navigate]);

  return {
    file,
    isLoading: isLoading && !!codeHashUrlParam,
    isStored,
    ...metadata,
  };
};
