// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { Fragment, ReactNode } from 'react';

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (_: boolean) => void;
  title: string;
  children?: ReactNode | undefined;
};

export const ModalBase = ({ isOpen, setIsOpen, title, children }: ModalProps) => {
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      <Transition appear as={Fragment} show={isOpen}>
        <Dialog as="div" className="z-99 fixed inset-0 overflow-y-auto " onClose={closeModal}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-10 dark:opacity-70" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span aria-hidden="true" className="inline-block h-screen align-middle">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full  max-w-lg transform overflow-hidden rounded-xl bg-white text-left align-middle opacity-100 shadow-xl transition-all dark:bg-gray-900">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800">
                  <Dialog.Title
                    as="h3"
                    className="p-6 text-lg font-bold leading-6 text-gray-600 dark:text-gray-300"
                  >
                    {title}
                  </Dialog.Title>
                  <XIcon
                    aria-hidden="true"
                    className="mx-6 mt-7 h-4 w-4 cursor-pointer text-gray-500"
                    onClick={closeModal}
                  />
                </div>
                <div className="px-6">{children}</div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
