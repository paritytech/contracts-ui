// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Abi } from 'types';
import { MessageDocs } from 'ui/components/message/message-docs';
import { Button } from 'ui/components/common';
import { FormField, getValidation, InputFile, useMetadataField } from 'ui/components/form';
import { useDatabase } from 'ui/contexts';

interface Props {
  abi: Abi;
  id: number | undefined;
}

export const MetadataTab = ({ id, abi }: Props) => {
  const { db } = useDatabase();
  const {
    file,
    value: metadata,
    isLoading,
    isStored,
    onChange,
    onRemove,
    isSupplied,
    isValid,
    ...metadataValidation
  } = useMetadataField();

  if (!abi) return null;

  return (
    <div className="grid w-full grid-cols-12">
      <div className="col-span-6 w-full rounded-lg lg:col-span-7 2xl:col-span-8">
        <div className="mb-10" data-cy="contract-docs">
          {abi.constructors.concat(abi.messages).map(message => (
            <MessageDocs
              className={'mb-4'}
              key={message.identifier}
              message={message}
              registry={abi.registry}
            />
          ))}
        </div>
        <FormField
          help={
            'Change the metadata associated with this contract. Useful for upgradable contracts.'
          }
          id="metadata"
          label={'Update Metadata'}
          {...getValidation(metadataValidation)}
          className="pb-5"
        >
          <InputFile
            className="mb-5"
            isError={metadataValidation.isError}
            onChange={onChange}
            onRemove={onRemove}
            placeholder="Click to select or drag and drop to upload file."
            value={file}
          />
        </FormField>
        <Button
          className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-gray-500 dark:border-gray-700 dark:bg-elevation-1 dark:text-gray-300 dark:enabled:hover:bg-elevation-2"
          isDisabled={!isSupplied || !isValid}
          onClick={async () => {
            if (!metadata || !id) throw new Error('Unable to update metadata.');
            await db.contracts.update(id, { abi: metadata.json });
            onRemove();
          }}
        >
          Update metadata
        </Button>
      </div>
    </div>
  );
};
