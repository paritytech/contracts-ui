// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { UIGas, UseBalance, UseStorageDepositLimit } from 'types';

import { InputWeight } from 'ui/components/form/InputWeight';
import { InputBalance } from 'ui/components/form/InputBalance';
import { InputStorageDepositLimit } from 'ui/components/form/InputStorageDepositLimit';
import { FormField } from 'ui/components/form/FormField';

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
          help="The maximum amount of gas to use for execution (the old gas limit). If the transaction requires more, it will fail."
          id="maxRefTime"
          label="RefTime Limit"
          isError={!refTime.isValid}
          message={!refTime.isValid && refTime.errorMsg}
          className="basis-2/4 mr-4"
        >
          <InputWeight {...refTime} name="RefTime" />
        </FormField>
        <FormField
          help="The maximum amount of gas to use for PoV. If the transaction requires more, it will fail."
          id="maxProofSize"
          label="ProofSize Limit"
          isError={!proofSize.isValid}
          message={!proofSize.isValid && proofSize.errorMsg}
          className="basis-2/4 ml-4"
        >
          <InputWeight {...proofSize} name="ProofSize" />
        </FormField>
      </div>
      <div className="flex justify-between">
        <FormField
          help="The maximum balance allowed to be deducted from the sender account for any additional storage deposit."
          id="storageDepositLimit"
          label="Storage Deposit Limit"
          isError={!storageDepositLimit.isValid}
          message={
            !storageDepositLimit.isValid
              ? storageDepositLimit.message || 'Invalid storage deposit limit'
              : null
          }
          className="basis-2/4 mr-4"
        >
          <InputStorageDepositLimit {...storageDepositLimit} />
        </FormField>
        {isPayable && (
          <FormField
            help="The balance to transfer to the contract as part of this call."
            id="value"
            label="Value"
            {...valueValidation}
            className="basis-2/4 ml-4"
          >
            <InputBalance value={value} onChange={setValue} placeholder="Value" />
          </FormField>
        )}
      </div>
    </>
  );
}
