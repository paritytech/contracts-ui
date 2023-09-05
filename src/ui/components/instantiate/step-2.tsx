// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { hasRevertFlag } from 'lib/has-revert-flag';
import { isNumber, genRanHex } from 'lib/util';
import { Button, Buttons, Dropdown } from 'ui/components/common';
import {
  InputSalt,
  OptionsForm,
  Form,
  FormField,
  getValidation,
  ArgumentForm,
} from 'ui/components/form';
import { createConstructorOptions } from 'ui/util/dropdown';
import { useApi, useInstantiate } from 'ui/contexts';
import {
  useArgValues,
  useFormField,
  useWeight,
  useToggle,
  useStorageDepositLimit,
  useBalance,
} from 'ui/hooks';
import { AbiMessage, Balance, OrFalsy } from 'types';
import {
  decodeStorageDeposit,
  encodeSalt,
  getGasLimit,
  getStorageDepositLimit,
} from 'lib/call-options';
import { BN_ZERO } from 'lib/bn';

function validateSalt(value: OrFalsy<string>) {
  if (!!value && value.length === 66) {
    return { isValid: true };
  }

  return { isValid: false, isError: true, message: 'Invalid hex string' };
}

export function Step2() {
  const { api } = useApi();
  const { data, setStep, step, setData, dryRunResult, setDryRunResult } = useInstantiate();
  const { accountId, metadata } = data;
  const [constructorIndex, setConstructorIndex] = useState<number>(0);
  const [deployConstructor, setDeployConstructor] = useState<AbiMessage>();
  const valueState = useBalance(BN_ZERO);
  const { value } = valueState;
  const refTime = useWeight(dryRunResult?.gasRequired.refTime.toBn());
  const proofSize = useWeight(dryRunResult?.gasRequired.proofSize.toBn());
  const storageDepositLimit = useStorageDepositLimit(accountId);
  const salt = useFormField<string>(genRanHex(64), validateSalt);
  const [argValues, setArgValues, inputData] = useArgValues(
    deployConstructor,
    metadata?.registry ?? api.registry,
  );
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const isCustom = refTime.mode === 'custom' || proofSize.mode === 'custom';

  const isReverted = hasRevertFlag(dryRunResult);

  useEffect(() => {
    setConstructorIndex(0);
    metadata && setDeployConstructor(metadata.constructors[0]);
  }, [metadata, setConstructorIndex]);

  const [isUsingSalt, toggleIsUsingSalt] = useToggle(true);

  const params: Parameters<typeof api.call.contractsApi.instantiate> = useMemo(() => {
    return [
      accountId,
      deployConstructor?.isPayable
        ? api.registry.createType('Balance', value)
        : api.registry.createType('Balance', BN_ZERO),
      getGasLimit(isCustom, refTime.limit, proofSize.limit, api.registry),
      getStorageDepositLimit(storageDepositLimit.isActive, storageDepositLimit.value, api.registry),
      codeHashUrlParam ? { Existing: codeHashUrlParam } : { Upload: metadata?.info.source.wasm },
      inputData ?? '',
      isUsingSalt ? encodeSalt(salt.value) : '',
    ];
  }, [
    accountId,
    deployConstructor?.isPayable,
    value,
    isCustom,
    refTime.limit,
    proofSize.limit,
    api.registry,
    storageDepositLimit.isActive,
    storageDepositLimit.value,
    codeHashUrlParam,
    metadata?.info.source.wasm,
    inputData,
    isUsingSalt,
    salt.value,
  ]);

  useEffect((): void => {
    async function dryRun() {
      try {
        const result = await api.call.contractsApi.instantiate(...params);

        if (JSON.stringify(dryRunResult) !== JSON.stringify(result)) {
          setDryRunResult(result);
        }
      } catch (e) {
        console.error(e);
      }
    }
    dryRun().catch(e => console.error(e));
  }, [api.call.contractsApi, dryRunResult, params, setDryRunResult]);

  const onSubmit = () => {
    if (!dryRunResult) return;

    const { storageDeposit, gasRequired } = dryRunResult;
    const { isActive, value: userInput } = storageDepositLimit;
    const predictedStorageDeposit = decodeStorageDeposit(storageDeposit);
    setData({
      ...data,
      constructorIndex,
      salt: params[6] || null,
      value: deployConstructor?.isPayable ? (params[1] as Balance) : undefined,
      argValues,
      storageDepositLimit: getStorageDepositLimit(
        isActive,
        userInput,
        api.registry,
        predictedStorageDeposit,
      ),
      gasLimit: getGasLimit(isCustom, refTime.limit, proofSize.limit, api.registry) ?? gasRequired,
    });
    setStep(3);
  };

  if (step !== 2) return null;

  return metadata ? (
    <>
      <Form>
        <FormField
          help="The constructor to use for this contract deployment."
          id="constructor"
          label="Deployment Constructor"
        >
          <Dropdown
            className="mb-4"
            id="constructor"
            onChange={v => {
              if (isNumber(v)) {
                setConstructorIndex(v);
                setDeployConstructor(metadata.constructors[v]);
              }
            }}
            options={createConstructorOptions(metadata.registry, metadata.constructors)}
            value={constructorIndex}
          >
            No constructors found
          </Dropdown>
          {deployConstructor && argValues && (
            <ArgumentForm
              argValues={argValues}
              args={deployConstructor.args}
              className="argument-form"
              key={`args-${deployConstructor.method}`}
              registry={metadata.registry}
              setArgValues={setArgValues}
            />
          )}
        </FormField>
        <FormField
          help="A hex or string value that acts as a salt for this deployment."
          id="salt"
          label="Deployment Salt"
          {...getValidation(salt)}
        >
          <InputSalt isActive={isUsingSalt} toggleIsActive={toggleIsUsingSalt} {...salt} />
        </FormField>
        <OptionsForm
          isPayable={!!deployConstructor?.isPayable}
          proofSize={proofSize}
          refTime={refTime}
          storageDepositLimit={storageDepositLimit}
          value={valueState}
        />
      </Form>
      <Buttons>
        <Button
          onClick={() => {
            setStep(1);
          }}
          variant="default"
        >
          Go Back
        </Button>

        <Button
          data-cy="next-btn"
          isDisabled={
            (deployConstructor?.isPayable && !valueState.isValid) ||
            !salt.isValid ||
            !refTime.isValid ||
            !proofSize.isValid ||
            !storageDepositLimit.isValid ||
            !deployConstructor?.method ||
            !!dryRunResult?.result.isErr ||
            !dryRunResult ||
            isReverted
          }
          onClick={onSubmit}
          variant="primary"
        >
          Next
        </Button>
      </Buttons>
    </>
  ) : null;
}
