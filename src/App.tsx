import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './components/AuthScreen';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-primary-green" size={48} />
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          !isAuthenticated ? (
            <AnimatePresence mode="wait">
              <AuthScreen key="auth" />
            </AnimatePresence>
          ) : !user?.onboardingComplete ? (
            <AnimatePresence mode="wait">
              <Onboarding key="onboarding" />
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <Dashboard key="dashboard" />
            </AnimatePresence>
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

