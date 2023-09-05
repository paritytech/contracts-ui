// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChevronRightIcon } from '@heroicons/react/outline';
import { BookOpenIcon } from '@heroicons/react/solid';
import { GithubLogo, StackExchangeLogo } from './logos';
import { ModalBase as Modal } from './modal-base';
import type { ModalProps } from './modal-base';

export const HelpModal = ({ isOpen, setIsOpen }: Omit<ModalProps, 'title'>) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Help">
      <ul className="text-sm text-gray-600 dark:text-gray-200">
        <li>
          <a
            className="flex items-center justify-between w-full text-gray-600 border-b border-gray-200 group dark:border-gray-800 dark:text-white"
            href="https://paritytech.github.io/ink-docs/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex py-4">
              <div className="w-5 mr-2" style={{ position: 'relative', top: 2 }}>
                <BookOpenIcon aria-hidden="true" className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <strong>ink! Docs</strong>
                <span className="text-gray-500 dark:text-gray-400">
                  Read more about the ink! smart contract language.
                </span>
              </div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-500 group-hover:opacity-50 dark:text-gray-400" />
          </a>
        </li>
        <li>
          <a
            className="flex items-center justify-between w-full text-gray-600 border-b border-gray-200 group dark:border-gray-800 dark:text-white"
            href="https://substrate.stackexchange.com/questions/tagged/smart-contract?sort=Newest"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex py-4">
              <div className="w-5 mr-2" style={{ position: 'relative', top: 2 }}>
                <StackExchangeLogo />
              </div>
              <div className="flex flex-col">
                <strong>Stack Exchange</strong>
                <span className="text-gray-500 dark:text-gray-400">
                  Browse through common questions.{' '}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-500 group-hover:opacity-50 dark:text-gray-400" />
          </a>
        </li>
        <li>
          <a
            className="flex items-center justify-between w-full text-gray-600 border-b border-gray-200 group dark:border-gray-800 dark:text-white"
            href="https://github.com/paritytech/contracts-ui"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex py-4">
              <div className="relative w-5 mr-2" style={{ position: 'relative', top: 1 }}>
                <GithubLogo />
              </div>
              <div className="flex flex-col">
                <strong>Github Repo</strong>
                <span className="text-gray-500 dark:text-gray-400">
                  Let us know if there is an issue.{' '}
                </span>
              </div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-500 group-hover:opacity-50 dark:text-gray-400" />
          </a>
        </li>
        <li>
          <a
            className="flex items-center justify-between w-full group"
            href="https://github.com/paritytech/contracts-ui/blob/master/FAUCETS.md"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex py-4">
              <div className="relative w-5 mr-2" style={{ position: 'relative', top: 1 }}>
                <svg
                  className="rotate-180 "
                  fill="rgb(154 159 169)"
                  height={20}
                  stroke="none"
                  viewBox="0 0 24 24"
                  width={20}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <strong>Faucets</strong>
                <span className="text-gray-500 dark:text-gray-400">Get testnet tokens.</span>
              </div>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-500 group-hover:opacity-50 dark:text-gray-400" />
          </a>
        </li>
      </ul>
    </Modal>
  );
};
