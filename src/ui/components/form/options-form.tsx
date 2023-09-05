// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { UIGas, UseBalance, UseStorageDepositLimit } from 'types';

import { InputWeight } from 'ui/components/form/input-weight';
import { InputBalance } from 'ui/components/form/Input-balance';
import { InputStorageDepositLimit } from 'ui/components/form/input-storage-deposit-limit';
import { FormField } from 'ui/components/form/form-field';

interface Props {
  isPayable: boolean;
  refTime: UIGas;
  proofSize: UIGas;
  storageDepositLimit: UseStorageDepositLimit;
  value: UseBalance;
}

export function OptionsForm({
  isPayable,
  refTime,
  proofSize,
  storageDepositLimit,
  value: { value, onChange: setValue, ...valueValidation },
}: Props) {
  return (
    <>
      <div className="flex justify-between">
        <FormField
          className="mr-4 basis-2/4"
          help="The maximum amount of computational time that can be used for execution, in picoseconds. If the transaction requires more, it will fail."
          id="maxRefTime"
          isError={!refTime.isValid}
          label="RefTime Limit"
          message={!refTime.isValid && refTime.errorMsg}
        >
          <InputWeight {...refTime} name="RefTime" />
        </FormField>
        <FormField
          className="ml-4 basis-2/4"
          help="The maximum amount of storage space that can be used, in bytes. If the transaction requires more, it will fail."
          id="maxProofSize"
          isError={!proofSize.isValid}
          label="ProofSize Limit"
          message={!proofSize.isValid && proofSize.errorMsg}
        >
          <InputWeight {...proofSize} name="ProofSize" />
        </FormField>
      </div>
      <div className="flex justify-between">
        <FormField
          className="mr-4 basis-2/4"
          help="The maximum balance allowed to be deducted from the sender account for any additional storage deposit."
          id="storageDepositLimit"
          isError={!storageDepositLimit.isValid}
          label="Storage Deposit Limit"
          message={
            !storageDepositLimit.isValid
              ? storageDepositLimit.message || 'Invalid storage deposit limit'
              : null
          }
        >
          <InputStorageDepositLimit {...storageDepositLimit} />
        </FormField>
        {isPayable && (
          <FormField
            help="The balance to transfer to the contract as part of this call."
            id="value"
            label="Value"
            {...valueValidation}
            className="ml-4 basis-2/4"
          >
            <InputBalance onChange={setValue} placeholder="Value" value={value} />
          </FormField>
        )}
      </div>
    </>
  );
}
