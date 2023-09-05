// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BellIcon, XIcon } from '@heroicons/react/outline';
import { NotificationIcon } from './common/notification-icon';
import { classes, isEmptyObj } from 'lib/util';
import type { QueuedTxOptions, TransactionsState } from 'types';

export function Transactions({
  dismiss,
  txs,
}: React.HTMLAttributes<HTMLDivElement> & TransactionsState) {
  return (
    <div className={classes('fixed right-3 top-3 z-10 w-80')}>
      {Object.entries(txs).map(([id, tx]: [string, QueuedTxOptions | undefined]) => {
        const { status, events, extrinsic } = tx || {};
        const isComplete = status === 'error' || status === 'success';

        return (
          <div key={`notification-${id}`}>
            <div
              className="flex max-w-full items-center bg-gray-200 p-3 text-gray-600 dark:bg-elevation-2 dark:text-white"
              data-cy="transaction-queued"
              key={id}
            >
              <NotificationIcon status={status} />
              <div className="flex-grow pl-2 text-sm">
                <div>{extrinsic?.registry.findMetaCall(extrinsic.callIndex).method}</div>
                <div className="text-gray-400">{status}</div>
              </div>
              {isComplete && (
                <XIcon
                  className="h-4 w-4 text-gray-400"
                  data-cy="dismiss-notification"
                  onClick={() => dismiss(parseInt(id))}
                />
              )}
            </div>
            {isComplete && events && !isEmptyObj(events) && (
              <div
                className="mt-2 flex max-w-full items-center bg-gray-200 p-3 text-gray-600 dark:bg-elevation-2 dark:text-white"
                data-cy="transaction-complete"
              >
                <BellIcon className="h-12 w-12 text-yellow-400" />
                <div className="flex-grow pl-2 text-sm">
                  {Object.keys(events).map(eventName => {
                    const times = events[eventName] > 1 ? ` (x${events[eventName]})` : '';
                    return (
                      <div className="dark:text-gray-400" key={eventName}>
                        {`${eventName}${times}`}
                      </div>
                    );
                  })}
                </div>
                <XIcon className="h-4 w-4 text-gray-400" onClick={() => dismiss(parseInt(id))} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
