import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { TooltipProvider } from './components/ui/tooltip';

const root = document.getElementById('root');
const queryClient = new QueryClient();

if (root) {
  ReactDOM.createRoot(root).render(
    // <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider delayDuration={300} disableHoverableContent>
            <App />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
    // </React.StrictMode>,
  );
} else {
  console.error("Root element with ID 'root' not found.");
}
