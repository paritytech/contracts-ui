// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Button } from '../common/button';

export function HelpBox(): React.ReactElement | null {
  return (
    <div className="mb-8 border-b border-gray-200 pb-8 dark:border-gray-800">
      <div className="relative w-auto rounded border border-gray-200 p-4 dark:border-gray-800 dark:bg-elevation-1">
        <div className="pb-1 text-sm font-semibold text-blue-500">Tell us more about yourself</div>
        <div className="pb-2 text-xs text-gray-500 dark:text-gray-400">
          We would love to know more about you so we can make our products better.
        </div>
        <div>
          <a href="https://forms.gle/hif9sHBr3bYPZjt38" rel="noreferrer" target="_blank">
            <Button className="border-2 px-3 py-1.5" variant="default">
              Take quick survey
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
