// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types/create';
import { Registry, TypeDef } from 'types';
import { classes } from 'lib/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  arg: { name?: string; type: TypeDef };
  registry: Registry;
  value?: string;
}

const MAX_PARAM_LENGTH = 20;

function truncate(param: string): string {
  return param.length > MAX_PARAM_LENGTH
    ? `${param.substring(0, MAX_PARAM_LENGTH / 2)}…${param.substring(
        param.length - MAX_PARAM_LENGTH / 2,
      )}`
    : param;
}

export function ArgSignature({
  arg: { name, type },
  children,
  className,
  registry,
  value,
  ...props
}: Props) {
  return (
    <span className={classes('font-mono', className)} {...props}>
      {name ? `${name}: ` : ''}
      <span>
        {value ? <b>{truncate(value)}</b> : type.typeName || encodeTypeDef(registry, type)}
      </span>
      {children}
    </span>
  );
}
