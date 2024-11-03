import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoadingProvider } from './contexts/LoadingContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import ResetPassword from './components/auth/ResetPassword';
import CompanyDashboard from './components/CompanyDashboard';
import CompanyList from './components/CompanyList';
import Analysis from './components/pages/Analysis';
import Settings from './components/pages/Settings';
import Error404 from './components/pages/Error404';
import Error500 from './components/pages/Error500';
import Maintenance from './components/pages/Maintenance';
import LoadingSpinner from './components/LoadingSpinner';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <LoadingProvider>
          <CurrencyProvider>
            <CompanyProvider>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<SignUpForm />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/500" element={<Error500 />} />
                <Route path="/*" element={
                  <PrivateRoute>
                    <div className="min-h-screen bg-gray-100">
                      <Header />
                      <Navigation />
                      <main className="container mx-auto px-4 py-8">
                        <div className="max-w-7xl mx-auto space-y-6">
                          <Routes>
                            <Route path="/" element={<CompanyDashboard />} />
                            <Route path="/companies" element={<CompanyList />} />
                            <Route path="/analysis" element={<Analysis />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<Error404 />} />
                          </Routes>
                        </div>
                      </main>
                    </div>
                  </PrivateRoute>
                } />
              </Routes>
            </CompanyProvider>
          </CurrencyProvider>
        </LoadingProvider>
      </ToastProvider>
    </Router>
  );
}