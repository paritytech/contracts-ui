// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from 'ui/components/app';
import 'react-tooltip/dist/react-tooltip.css';
import './styles/main.css';
import '@polkadot/api-augment';
import {
  AddContract,
  Contract,
  Homepage,
  Instantiate,
  SelectCodeHash,
  NotFound,
  AddressLookup,
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
      <Route element={<App />} path="/">
        <Route element={<Homepage />} index />
        <Route element={<AddContract />} path="add-contract" />
        <Route element={<AddressLookup />} path="address-lookup" />
        <Route element={<SelectCodeHash />} path="hash-lookup" />
        <Route element={<Instantiate />} path="instantiate">
          <Route path=":codeHash" />
        </Route>
        <Route element={<Contract />} path="contract/:address/" />
        <Route element={<NotFound />} path="*" />
      </Route>
    </Routes>
  </BrowserRouter>,
);
