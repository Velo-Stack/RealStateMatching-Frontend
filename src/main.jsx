import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './styles/index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Only apply theme if not on public pages
// Theme will be set by AppLayout for dashboard pages
const currentPath = window.location.pathname;
const isPublicPage = currentPath === '/' || 
                     currentPath.startsWith('/projects') || 
                     currentPath.startsWith('/about') || 
                     currentPath.startsWith('/blog') || 
                     currentPath.startsWith('/contact');

if (!isPublicPage) {
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
