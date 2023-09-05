// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CopyButton } from 'ui/components/common/copy-button';

export function OutcomeItem({
  displayValue,
  copyValue = JSON.stringify(displayValue),
  title,
  id,
}: {
  title: string;
  displayValue: string;
  copyValue?: string;
  id?: string;
}): JSX.Element {
  return (
    <div className="event-log mb-4">
      <div className="mb-1 leading-5">{title}</div>
      <div
        className="return-value relative break-all rounded-sm bg-gray-200 p-2 text-xs text-gray-600  dark:bg-elevation-1 dark:text-gray-400"
        data-cy="output"
      >
        <pre className="whitespace-pre-wrap">
          <code>{displayValue}</code>
        </pre>
        <CopyButton
          className="absolute bottom-2 right-2"
          id={title ? title.toLowerCase().replace(/\s+/g, '-') : id ?? ''}
          value={copyValue}
        />
      </div>
    </div>
  );
}
