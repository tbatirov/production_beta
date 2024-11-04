import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './i18n'; // Import i18n configuration
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  // <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  // </StrictMode>
);