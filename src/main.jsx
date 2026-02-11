import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './styles/index.css';
import App from './App.jsx';

const queryClient = new QueryClient();
const storedTheme = localStorage.getItem('theme');
const initialTheme = storedTheme === 'light' ? 'light' : 'dark';
document.documentElement.setAttribute('data-theme', initialTheme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  </StrictMode>,
);
