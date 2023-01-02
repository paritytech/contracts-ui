// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// temporarily disabled until polkadot-js types `ContractCallOutcome` and `ContractExecResult` transition to WeightV2
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { useEffect, useState, useRef, useMemo } from 'react';
import { ResultsOutput } from './ResultsOutput';
import {
  AbiMessage,
  ContractExecResult,
  ContractSubmittableResult,
  CallResult,
  ContractPromise,
  SubmittableResult,
} from 'types';
import { AccountSelect } from 'ui/components/account';
import { Dropdown, Button, Buttons } from 'ui/components/common';
import { ArgumentForm, Form, FormField, OptionsForm } from 'ui/components/form';
import {
  transformUserInput,
  BN_ZERO,
  getGasLimit,
  getStorageDepositLimit,
  decodeStorageDeposit,
} from 'helpers';
import { useApi, useTransactions } from 'ui/contexts';
import { useWeight, useBalance, useArgValues } from 'ui/hooks';
import { useStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';
import { createMessageOptions } from 'ui/util/dropdown';

interface Props {
  contract: ContractPromise;
}

export const InteractTab = ({
  contract: {
    abi,
    abi: { registry },
    tx,
    address,
  },
}: Props) => {
  const { accounts, api } = useApi();
  const { queue, process, txs } = useTransactions();
  const [message, setMessage] = useState<AbiMessage>();
  const [argValues, setArgValues] = useArgValues(message?.args || [], registry);
  const [callResults, setCallResults] = useState<CallResult[]>([]);
  const valueState = useBalance(BN_ZERO);
  const { value } = valueState;
  const [accountId, setAccountId] = useState('');
  const [txId, setTxId] = useState<number>(0);
  const [nextResultId, setNextResultId] = useState(1);
  const [outcome, setOutcome] = useState<ContractExecResult>();
  const storageDepositLimit = useStorageDepositLimit(accountId);
  //@ts-ignore
  const refTime = useWeight(outcome?.gasRequired.refTime.toBn());
  //@ts-ignore
  const proofSize = useWeight(outcome?.gasRequired.proofSize.toBn());
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const isCustom = refTime.mode === 'custom' || proofSize.mode === 'custom';

  const inputData = useMemo(() => {
    return message?.toU8a(transformUserInput(registry, message.args, argValues));
  }, [argValues, registry, message]);

  useEffect((): void => {
    if (!accounts || accounts.length === 0) return;
    setAccountId(accounts[0].address);
  }, [accounts]);

  useEffect(() => {
    setMessage(abi.messages[0]);
    setOutcome(undefined);
    // todo: call results storage
    setCallResults([]);
  }, [abi.messages, setArgValues, address]);

  useEffect((): void => {
    async function dryRun() {
      console.log('dry run');

      if (!message) return;

      const options = {
        gasLimit: getGasLimit(isCustom, refTime.limit, proofSize.limit, api.registry),
        storageDepositLimit: getStorageDepositLimit(
          storageDepositLimit.isActive,
          storageDepositLimit.value
        ),
        value: message?.isPayable ? value : undefined,
      };
      console.log('options proof', options.gasLimit?.proofSize.toHuman());
      console.log('options ref', options.gasLimit?.refTime.toHuman());

      const o = await api.call.contractsApi.call(
        accountId,
        address,
        options.value ?? BN_ZERO,
        options.gasLimit,
        options.storageDepositLimit ?? null,
        inputData ?? ''
      );
      setOutcome(o);
    }

    function debouncedDryRun() {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        dryRun().catch(err => console.error(err));
        timeoutId.current = null;
      }, 300);
    }

    debouncedDryRun();
  }, [
    accountId,
    address,
    api.call.contractsApi,
    api.registry,
    inputData,
    isCustom,
    message,
    proofSize.limit,
    refTime.limit,
    value,
    storageDepositLimit.isActive,
    storageDepositLimit.value,
  ]);

  useEffect(() => {
    async function processTx() {
      txs[txId]?.status === 'queued' && (await process(txId));
    }
    processTx().catch(e => console.error(e));
  }, [process, txId, txs]);

  const onSuccess = ({ events, contractEvents, dispatchError }: ContractSubmittableResult) => {
    message &&
      setCallResults([
        ...callResults,
        {
          id: nextResultId,
          message,
          time: Date.now(),
          contractEvents,
          events,
          error: dispatchError?.isModule
            ? api.registry.findMetaError(dispatchError.asModule)
            : undefined,
        },
      ]);

    setNextResultId(nextResultId + 1);
  };

  const newId = useRef<number>();

  const call = () => {
    if (!outcome) throw new Error('Unable to dry run contract call.');
    const { storageDeposit, gasRequired } = outcome;
    const { isActive, value: userInput } = storageDepositLimit;
    const predictedStorageDeposit = decodeStorageDeposit(storageDeposit);
    const options = {
      gasLimit: getGasLimit(isCustom, refTime.limit, proofSize.limit, api.registry) ?? gasRequired,
      storageDepositLimit: getStorageDepositLimit(isActive, userInput, predictedStorageDeposit),
      value: message?.isPayable ? value : undefined,
    };

    const isValid = (result: SubmittableResult) => !result.isError && !result.dispatchError;

    const extrinsic =
      message &&
      tx[message.method](options, ...transformUserInput(registry, message.args, argValues));

    if (extrinsic && accountId) {
      newId.current = queue({
        extrinsic,
        accountId,
        onSuccess,
        isValid,
      });
      setTxId(newId.current);
    }
  };

  const decodedOutput = outcome?.result?.toHuman();

  const callDisabled =
    !refTime.isValid ||
    !proofSize.isValid ||
    txs[txId]?.status === 'processing' ||
    !!outcome?.result.isErr ||
    (!!decodedOutput && typeof decodedOutput === 'object' && 'Err' in decodedOutput);

  const isDispatchable = message?.isMutating || message?.isPayable;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-6 2xl:col-span-7 rounded-lg w-full">
        <Form key={`${address}`}>
          <FormField
            className="mb-8 caller"
            help="The sending account for this interaction. Any transaction fees will be deducted from this account."
            id="accountId"
            label="Caller"
          >
            <AccountSelect
              id="accountId"
              className="mb-2"
              value={accountId}
              onChange={setAccountId}
            />
          </FormField>
          <FormField
            help="The message to send to this contract. Parameters are adjusted based on the stored contract metadata."
            id="message"
            label="Message to Send"
          >
            <Dropdown
              id="message"
              options={createMessageOptions(registry, abi.messages)}
              className="constructorDropdown mb-4"
              onChange={(m?: AbiMessage) => {
                m?.identifier !== message?.identifier && setOutcome(undefined);
                setMessage(m);
              }}
              value={message}
            >
              No messages found
            </Dropdown>
            {argValues && (
              <ArgumentForm
                args={message?.args ?? []}
                registry={registry}
                setArgValues={setArgValues}
                argValues={argValues}
              />
            )}
          </FormField>

          {isDispatchable && (
            <OptionsForm
              isPayable={!!message.isPayable}
              refTime={refTime}
              proofSize={proofSize}
              value={valueState}
              storageDepositLimit={storageDepositLimit}
            />
          )}
        </Form>
        <Buttons>
          {isDispatchable && (
            <Button
              isDisabled={callDisabled}
              isLoading={txs[txId]?.status === 'processing'}
              onClick={call}
              variant="primary"
            >
              Call contract
            </Button>
          )}
        </Buttons>
      </div>
      <div className="col-span-6 lg:col-span-6 2xl:col-span-5 pl-10 lg:pl-20 w-full">
        {message && (
          <ResultsOutput
            registry={registry}
            results={callResults}
            outcome={outcome}
            message={message}
          />
        )}
      </div>
    </div>
  );
};
