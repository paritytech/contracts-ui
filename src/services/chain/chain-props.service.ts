// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TypeRegistry } from '@polkadot/types/create';
import { DEFAULT_DECIMALS } from '../../constants';
import { ChainProperties, ApiPromise } from 'types';

const registry = new TypeRegistry();

export async function getChainProperties(api: ApiPromise): Promise<ChainProperties> {
  const [chainProperties, systemName, systemVersion, systemChain, systemChainType] =
    await Promise.all([
      api.rpc.system.properties(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      (await api.rpc.system.chain()).toString(),
      api.rpc.system.chainType
        ? api.rpc.system.chainType()
        : Promise.resolve(registry.createType('ChainType', 'Live')),
      api.rpc.system,
    ]);

  const result = {
    genesisHash: api.genesisHash.toHex(),
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
    systemChainType,
    systemChain,
    tokenDecimals: chainProperties.tokenDecimals.isSome
      ? chainProperties.tokenDecimals.unwrap().toArray()[0].toNumber()
      : DEFAULT_DECIMALS,
    tokenSymbol: chainProperties.tokenSymbol.isSome
      ? chainProperties.tokenSymbol
          .unwrap()
          .toArray()
          .map(s => s.toString())[0]
      : 'Unit',
  };

  return result;
}
