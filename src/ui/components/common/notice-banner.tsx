// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EmojiSadIcon } from '@heroicons/react/outline';

export function NoticeBanner({ isVisible, endpoint }: { isVisible: boolean; endpoint: string }) {
  return isVisible ? (
    <div className="fixed left-1/3 right-1/3 top-10 z-50 flex h-2/5 w-2/5 flex-col items-center justify-center bg-gray-200 p-6 text-center text-gray-400 dark:bg-gray-800">
      <EmojiSadIcon className="mb-1 h-10 w-10 justify-self-center text-red-400" />

      <h1 className="mb-3 text-red-400">Unsupported node version.</h1>
      <p>
        Looks like your node does not support <span>WeightV2</span>.
      </p>
      <p>
        Upgrade your node or{' '}
        <a
          className="text-blue-400 underline"
          href={`https://weightv1--contracts-ui.netlify.app/?rpc=${endpoint}`}
        >
          click here
        </a>{' '}
        to use an older version of Contracts UI.
      </p>
    </div>
  ) : null;
}
