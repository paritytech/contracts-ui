// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types/create';
import { DatabaseIcon } from '@heroicons/react/outline';
import { ArgSignature } from './arg-signature';
import type { AbiMessage, Registry } from 'types';
import { classes } from 'lib/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: Partial<AbiMessage>;
  params?: unknown[];
  registry: Registry;
}

export function MessageSignature({
  className,
  message: { args, isConstructor, isMutating, method, returnType },
  params = [],
  registry,
}: Props) {
  return (
    <div className={classes('font-mono', isConstructor && 'constructor', className)}>
      <span
        className={
          isConstructor
            ? 'text-purple-700 dark:text-blue-400'
            : 'text-yellow-700 dark:text-yellow-400'
        }
      >
        {method}
      </span>
      (
      {args?.map((arg, index): React.ReactNode => {
        return (
          <ArgSignature
            arg={arg}
            key={`${name}-args-${index}`}
            registry={registry}
            value={params[index] ? (params[index] as string) : undefined}
          >
            {index < args.length - 1 && ', '}
          </ArgSignature>
        );
      })}
      )
      {!isConstructor && returnType && (
        <>
          : <span>{encodeTypeDef(registry, returnType)}</span>
        </>
      )}
      {isMutating && (
        <>
          <DatabaseIcon className="ml-2 inline-block h-4 w-4 text-yellow-400" />
        </>
      )}
    </div>
  );
}
