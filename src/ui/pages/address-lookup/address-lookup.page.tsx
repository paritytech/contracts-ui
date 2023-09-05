// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { classes, isValidAddress } from 'lib/util';
import {
  Button,
  Buttons,
  FormField,
  getValidation,
  Input,
  InputFile,
  useMetadataField,
} from 'ui/components';
import { RootLayout } from 'ui/layout';
import { useApi, useDatabase } from 'ui/contexts';
import { useNonEmptyString } from 'ui/hooks/use-non-empty-string';
import { getContractInfo } from 'services/chain';

export function AddressLookup() {
  const [searchString, setSearchString] = useState('');
  const [address, setAddress] = useState('');
  const { api } = useApi();
  const navigate = useNavigate();

  const {
    file,
    value: metadata,
    isLoading,
    isStored,
    onChange,
    onRemove,
    ...metadataValidation
  } = useMetadataField();

  const { value: name, onChange: setName, ...nameValidation } = useNonEmptyString('New Contract');

  const { db } = useDatabase();

  useEffect((): void => {
    async function validate() {
      if (address !== searchString) {
        if (isValidAddress(searchString)) {
          const isOnChain = await getContractInfo(api, searchString);
          if (isOnChain) {
            const contract = await db.contracts.get({ address: searchString });
            contract ? navigate(`/contract/${searchString}`) : setAddress(searchString);
          } else {
            setAddress('');
          }
        } else {
          setAddress('');
        }
      }
    }
    validate().catch(e => console.error(e));
  }, [api, address, searchString, db.contracts, navigate]);
  return (
    <RootLayout
      heading="Add contract from address"
      help={<>Add metadata to an existing contract instance in order to interact with it.</>}
    >
      <FormField
        className="relative"
        help="The address of the contract you want to interact with"
        id="address"
        isError={!!searchString && !address}
        label="Contract Address"
        message={isValidAddress(searchString) ? 'Address is not on-chain ' : 'Address is not valid'}
      >
        {' '}
        <Input
          className={classes('relative mb-4 flex items-center')}
          onChange={setSearchString}
          placeholder="Paste an on-chain contract address"
          value={searchString}
        >
          {address ? (
            <div className="absolute flex items-center text-green-500 right-2">
              <span className="mr-1 text-xs w-22">on-chain</span>
              <CheckCircleIcon aria-hidden="true" className="w-4 h-4" />
            </div>
          ) : (
            searchString && (
              <XCircleIcon aria-hidden="true" className="w-5 h-5 -ml-8 text-red-500" />
            )
          )}
        </Input>
      </FormField>

      {address && (
        <>
          <FormField
            help="A name for the new contract to help users distinguish it. Only used for display purposes."
            id="name"
            label="Contract Name"
            {...nameValidation}
          >
            <Input
              id="contractName"
              onChange={setName}
              placeholder="Give your contract a descriptive name"
              value={name}
            />
          </FormField>
          <FormField
            help={
              'The contract metadata JSON file to use in order to interact with this contract. Constructor and message information will be derived from this file.'
            }
            id="metadata"
            label={'Upload Metadata'}
            {...getValidation(metadataValidation)}
          >
            <InputFile
              isError={metadataValidation.isError}
              onChange={onChange}
              onRemove={onRemove}
              placeholder="Click to select or drag and drop to upload file."
              value={file}
            />
          </FormField>
          <Buttons>
            <Button
              data-cy="next-btn"
              isDisabled={!metadata || !nameValidation.isValid || !metadataValidation.isValid}
              onClick={async () => {
                if (!metadata) return;
                const document = {
                  abi: metadata.json,
                  address,
                  codeHash: metadata.info.source.wasmHash.toHex(),
                  date: new Date().toISOString(),
                  name,
                  external: true,
                };
                await db.contracts.add(document);
                navigate(`/contract/${address}`);
              }}
              variant="primary"
            >
              Add contract
            </Button>
          </Buttons>
        </>
      )}
    </RootLayout>
  );
}
