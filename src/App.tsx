import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, loading } = useApp();

  console.log('AppContent render:', { isAuthenticated, hasUser: !!user, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary-green" size={48} />
          <p className="text-slate-400 font-medium text-sm animate-pulse italic">CARREGANDO...</p>
        </div>
      </div>
    );
  }

  // If authenticated but user profile is missing during transition
  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">
         <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary-green" size={48} />
          <p className="text-slate-400 font-medium text-sm animate-pulse italic">PREPARANDO SEU PERFIL...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="w-full h-full">
            {!user?.onboardingComplete ? (
              <Onboarding key="onboarding" />
            ) : (
              <Dashboard key="dashboard" />
            )}
          </div>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

