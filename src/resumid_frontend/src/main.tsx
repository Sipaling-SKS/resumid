import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import './index.css';
import { AuthProvider } from './hooks/AuthContext';
import { DataProvider } from './hooks/DataContext';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    // <React.StrictMode>
      <AuthProvider>
        <DataProvider>
      <BrowserRouter>
          <App />

      </BrowserRouter>
        </DataProvider>

      </AuthProvider>
    // </React.StrictMode>,
  );
} else {
  console.error("Root element with ID 'root' not found.");
}
