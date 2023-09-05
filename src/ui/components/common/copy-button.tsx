// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import copy from 'copy-to-clipboard';
import { MouseEventHandler, useCallback, useRef, useState } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/outline';
import { Tooltip } from 'react-tooltip';
import { Button } from './button';
import { classes } from 'lib/util';

interface Props extends React.HTMLAttributes<unknown> {
  iconClassName?: string;
  value: string;
  id: string;
}

export function CopyButton({ className, iconClassName, value, id }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const onClick: MouseEventHandler = useCallback(
    (event): void => {
      event.stopPropagation();
      copy(value);
      setShowTooltip(true);
      setTimeout(() => {
        setShowTooltip(false);
      }, 1000);
    },
    [value],
  );

  return (
    <>
      <Button
        className={classes('', className)}
        data-tooltip-content="Copied to clipboard"
        data-tooltip-id={id}
        onClick={onClick}
        ref={ref}
        variant="plain"
      >
        <DocumentDuplicateIcon
          className={classes('h-4 w-4 hover:text-gray-600 dark:hover:text-gray-300', iconClassName)}
        />
      </Button>
      <Tooltip id={id} isOpen={showTooltip} place="top" />
    </>
  );
}
