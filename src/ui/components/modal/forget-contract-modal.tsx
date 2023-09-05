// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TrashIcon } from '@heroicons/react/outline';
import { ModalBase as Modal } from './modal-base';
import type { ModalProps } from './modal-base';

interface Props extends ModalProps {
  confirm: () => void;
}

export const ForgetContractModal = ({ isOpen, setIsOpen, confirm }: Omit<Props, 'title'>) => {
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Confirm action">
      <div className="py-8 text-sm text-gray-400 dark:text-gray-500">
        <p className="mb-8">
          You will remove the metadata for this contract instance from browser storage. This
          operation has no on-chain consequences. <br /> The forget operation only limits your
          access to the contract on this browser.
        </p>
        <button
          className="h-full items-center rounded border p-3 font-semibold text-gray-600 hover:text-gray-400 dark:border-gray-700 dark:bg-elevation-1 dark:text-gray-300 dark:hover:bg-elevation-2"
          onClick={() => confirm()}
          title="Forget contract"
        >
          <p className="mr-2 text-xs">Forget contract</p>
          <TrashIcon className="mr-1 w-4 justify-self-end dark:text-gray-500" />
        </button>
      </div>
    </Modal>
  );
};
