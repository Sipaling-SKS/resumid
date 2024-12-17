import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import './index.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    // <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    // </React.StrictMode>,
  );
} else {
  console.error("Root element with ID 'root' not found.");
}
