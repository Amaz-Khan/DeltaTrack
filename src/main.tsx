import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from "./app/store";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
  theme={{
    token: {
      colorPrimary: '#06266bff',
      borderRadius: 10,
      fontSize: 14,
    },
  }}
>
  <Provider store={store}>
  <App />
  </Provider>
</ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
