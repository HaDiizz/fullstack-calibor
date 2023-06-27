import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import DataProvider from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
    <DataProvider>
      <App />
    </DataProvider>
);
