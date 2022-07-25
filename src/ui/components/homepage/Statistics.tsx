// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useState } from 'react';
import { formatNumber } from '@polkadot/util';
import { useApi } from 'ui/contexts';
import { ChainProperties } from 'types';

function getChainType(systemChainType: ChainProperties['systemChainType']): string {
  if (systemChainType.isDevelopment) return 'Development';
  if (systemChainType.isLocal) return 'Local';
  if (systemChainType.isLive) return 'Live';
  if (systemChainType.isCustom) return 'Custom';
  return 'Unknown';
}

export function Statistics(): React.ReactElement | null {
  const { api, systemChain, systemName, systemChainType, tokenSymbol } = useApi();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    async function listenToBlocks() {
      return api?.rpc.chain.subscribeNewHeads(header => {
        setBlockNumber(header.number.toNumber());
      });
    }

    let cleanUp: VoidFunction;

    listenToBlocks()
      .then(unsub => (cleanUp = unsub))
      .catch(console.error);

    return () => cleanUp();
  }, [api]);

  const entries = useMemo((): Record<string, React.ReactNode> => {
    return {
      'Chain Name': systemChainType.isDevelopment ? systemName : systemChain,
      'Chain Type': getChainType(systemChainType),
      'Highest Block': `#${formatNumber(blockNumber)}`,
      Token: tokenSymbol,
    };
  }, [blockNumber, systemChain, systemChainType, systemName, tokenSymbol]);

  return (
    <>
      <div
        className="grid grid-cols-4 xl:grid-cols-2 w-full mb-8 pb-8 border-b border-gray-200 dark:border-gray-800"
        data-cy="chain-info"
      >
        {Object.entries(entries).map(([label, value], i) => {
          return (
            <div key={`entry-${i}`} className="mb-4 pr-4">
              <div className="text-xs mb-1">{label}</div>
              <div className="dark:text-gray-400">{value}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
