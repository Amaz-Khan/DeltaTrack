import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
  theme={{
    token: {
      colorPrimary: '#4f46e5',
      borderRadius: 10,
      fontSize: 14,
    },
  }}
>
  <App />
</ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
