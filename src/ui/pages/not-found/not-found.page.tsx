// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { EmojiSadIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router';
import { Button } from 'ui/components';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="m-2 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden px-5 py-3">
      <div className=" grid h-60 w-7/12 place-content-center border dark:border-gray-700">
        <EmojiSadIcon className="mb-1 h-10 w-10 justify-self-center text-green-400" />
        <p className="mb-6 text-sm text-gray-300">This page does not exist.</p>
        <Button className="justify-self-center" onClick={() => navigate('/')} variant="primary">
          Go Home
        </Button>
      </div>
    </div>
  );
}
