// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChatAltIcon, CogIcon } from '@heroicons/react/outline';
import { useCallback, useState } from 'react';
import { HelpModal } from 'ui/components/modal';
import { SettingsModal } from 'ui/components/modal/settings-modal';

type ModalName = 'help' | 'settings';

export function Footer() {
  const [visibleModal, setVisibleModal] = useState<ModalName | undefined>(undefined);

  const createSetVisibleModal = useCallback(
    (modal: ModalName) => (isOpen: boolean) => {
      if (isOpen) {
        setVisibleModal(modal);
      } else {
        setVisibleModal(undefined);
      }
    },
    [setVisibleModal],
  );

  return (
    <footer className="footer">
      <div>
        <a
          className="flex items-center content-center py-2 font-medium text-gray-600 cursor-pointer text-md hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-300 md:py-0 md:text-xs md:dark:text-gray-400"
          onClick={() => setVisibleModal('help')}
        >
          <ChatAltIcon aria-hidden="true" className="w-4 h-4 mr-2 dark:text-gray-500" />
          Help &amp; Feedback
        </a>
        <a
          className="flex items-center content-center py-2 font-medium text-gray-600 cursor-pointer text-md hover:text-gray-400 dark:text-gray-300 dark:hover:text-gray-300 md:py-0 md:text-xs md:dark:text-gray-400"
          onClick={() => setVisibleModal('settings')}
        >
          <CogIcon
            aria-hidden="true"
            className="w-4 h-4 mr-2 text-gray-600 hover:text-gray-400 dark:text-gray-500 dark:hover:text-gray-300"
          />
          <div className="text-md dark:text-gray-300 md:hidden">Settings</div>
        </a>
      </div>
      <HelpModal isOpen={visibleModal === 'help'} setIsOpen={createSetVisibleModal('help')} />
      <SettingsModal
        isOpen={visibleModal === 'settings'}
        setIsOpen={createSetVisibleModal('settings')}
      />
    </footer>
  );
}
