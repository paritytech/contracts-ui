import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import '../styles/main.css';
import { App } from 'ui/components';
import { publicUrl } from 'ui/util';
console.log(process.env.PUBLIC_URL);

const root = document.getElementById('app-root');
ReactDOM.render(
  <BrowserRouter basename={publicUrl}>
    <App />
  </BrowserRouter>,
  root
);

if (module.hot) {
  module.hot.accept('./ui/components/App', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const NewApp = require('./ui/components/App').default;

    ReactDOM.render(<NewApp />, document.getElementById('app-root'));
  });
}
