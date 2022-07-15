// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from 'ui/components/App';
import './styles/main.css';
import '@polkadot/api-augment';
import {
  AddContract,
  AddExisting,
  Contract,
  Homepage,
  Instantiate,
  SelectCodeHash,
  Settings,
  NotFound,
} from 'ui/pages';

globalThis.Buffer = Buffer;

const container = document.getElementById('app-root');
// non-null assertion encouraged by react 18 upgrade guide
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Homepage />} />
        <Route path="add" element={<AddContract />} />
        <Route path="add/code-hash/" element={<SelectCodeHash />} />
        <Route path="add/existing/" element={<AddExisting />} />
        <Route path="add/instantiate" element={<Instantiate />}>
          <Route path=":codeHash" />
        </Route>
        <Route path="contract/:address/" element={<Contract />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
