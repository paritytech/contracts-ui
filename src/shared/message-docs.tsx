// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSignature } from './dropdown/message-signature';
import type { AbiMessage, Registry } from '~/types';
import { classes } from '~/lib/util';

interface Props extends React.ComponentProps<typeof Disclosure> {
  message: AbiMessage;
  registry: Registry;
  className?: string;
}

export const MessageDocs = ({
  message,
  message: { docs },
  registry,
  className,
  ...restOfProps
}: Props) => {
  return (
    <Disclosure defaultOpen {...restOfProps}>
      {({ open }) => (
        <div className={classes('collapsible-panel', className)}>
          <Disclosure.Button
            className="flex w-full p-3 text-xs leading-normal text-left panel-title text-mono dark:bg-elevation-1"
            data-cy="message-docs"
          >
            <ChevronUpIcon
              className={`${!open ? 'rotate-180 transform' : ''} mr-1 h-5 w-5 border-gray-500`}
            />
            <MessageSignature message={message} registry={registry} />
          </Disclosure.Button>
          <Disclosure.Panel className="p-4 border-t border-gray-200 panel-body markdown dark:border-gray-700">
            {/* eslint-disable-next-line react/no-children-prop */}
            {docs.length ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs.join('\r\n')}</ReactMarkdown>
            ) : (
              <i>No documentation provided</i>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};