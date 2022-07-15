// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { XCircleIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { Input } from '../form/Input';
import { FormField, getValidation } from '../form/FormField';
import { InputFile, useMetadataField } from '../form';
import { Button, Buttons, Validation } from '../common';
import { classes } from 'ui/util';
import { checkOnChainContract } from 'api';
import { useApi, useDatabase } from 'ui/contexts';
import { useDebounce } from 'ui/hooks';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';

enum Status {
  AlreadyExists,
  Invalid,
  NotFound,
  Valid,
}

export function AddExistingForm() {
  const navigate = useNavigate();
  const { api, keyring } = useApi();
  const { db } = useDatabase();

  const [searchString, setSearchString] = useState('');
  const dbSearchString = useDebounce(searchString);

  const [address, setAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const { value: name, onChange: setName, ...nameValidation } = useNonEmptyString();

  const {
    file,
    value: metadata,
    isLoading,
    isStored,
    onChange,
    onRemove,
    ...metadataValidation
  } = useMetadataField();

  useEffect((): void => {
    if (metadataValidation.name && name === '') {
      setName(metadataValidation.name);
    }
  }, [metadataValidation.name, name, setName]);

  useEffect(() => {
    const validateString = async () => {
      if (dbSearchString === '') {
        setAddress(null);
        setStatus(null);

        return;
      }

      if (dbSearchString === address) {
        return;
      }

      try {
        keyring.decodeAddress(dbSearchString);
      } catch (e) {
        setStatus(Status.Invalid);

        return;
      }

      const alreadyExists = await db.contracts.get({ address: dbSearchString });

      if (alreadyExists) {
        setStatus(Status.AlreadyExists);

        return;
      }

      checkOnChainContract(api, dbSearchString)
        .then(isOnChain => {
          if (isOnChain) {
            setAddress(dbSearchString);
            setStatus(Status.Valid);
          } else {
            setStatus(Status.NotFound);
          }
        })
        .catch(console.error);
    };

    validateString().then().catch(console.error);
  }, [address, api, db.contracts, dbSearchString, keyring]);

  const onSubmit = useCallback(async (): Promise<void> => {
    if (!metadata || !address) return;

    const codeHash = metadata.info.source.wasmHash.toHex();

    const document = {
      abi: metadata.json,
      codeHash,
      date: new Date().toISOString(),
      name,
    };

    await db.addCodeBundle(document);

    await db.contracts.add({
      ...document,
      address,
    });

    navigate(`/contract/${address}`);
  }, [db, metadata, navigate, address, name]);

  return (
    <div>
      <FormField className="h-36 relative" label="Contract Address">
        <Input
          className={classes('relative flex items-center')}
          isDisabled={!!address}
          onChange={setSearchString}
          placeholder="Paste an address for a smart contract already instantiated on this blockchain"
          value={address || searchString}
        >
          {address && status === Status.Valid && (
            <button
              className="absolute right-2"
              onClick={() => {
                setSearchString('');
              }}
            >
              <XCircleIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
            </button>
          )}
        </Input>
        {status !== null &&
          (() => {
            switch (status) {
              case Status.Invalid:
                return (
                  <Validation type="error">
                    You have entered an invalid contract address.
                  </Validation>
                );

              case Status.NotFound:
                return (
                  <Validation type="error">
                    There is no smart contract instantiated at this address.
                  </Validation>
                );

              case Status.AlreadyExists:
                return (
                  <Validation type="success">
                    This smart contract has already been added to your database. You can view it{' '}
                    <Link to={`/contract/${dbSearchString}`}>here</Link>.
                  </Validation>
                );

              case Status.Valid:
                return <Validation type="success">Smart contract found!</Validation>;
            }
          })()}
      </FormField>

      {address && status === Status.Valid && (
        <>
          <FormField
            help="A name for the new contract to help users distinguish it. Only used for display purposes."
            id="name"
            label="Contract Name"
            {...nameValidation}
          >
            <Input
              id="contractName"
              placeholder="Give your contract a descriptive name"
              value={name}
              onChange={setName}
            />
          </FormField>
          <FormField
            help={
              'The contract metadata JSON file to save for this contract. Constructor and message information will be derived from this file. The WASM blob in the file, if present, will be ignored.'
            }
            id="metadata"
            label="Upload Metadata"
            {...getValidation(metadataValidation)}
          >
            <InputFile
              placeholder="Click to select or drag and drop to upload file."
              onChange={onChange}
              onRemove={onRemove}
              isError={metadataValidation.isError}
              value={file}
            />
          </FormField>
          <Buttons>
            <Button
              isDisabled={!metadata || !nameValidation.isValid || !metadataValidation.isValid}
              onClick={onSubmit}
              variant="primary"
              data-cy="next-btn"
            >
              Next
            </Button>
          </Buttons>
        </>
      )}
    </div>
  );
}
