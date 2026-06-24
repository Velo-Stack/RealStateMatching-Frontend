import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './styles/index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { isPublicAppPath } from './utils/publicRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

if (!isPublicAppPath(window.location.pathname)) {
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', initialTheme);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  </StrictMode>,
);
