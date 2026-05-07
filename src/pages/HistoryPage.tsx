import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { analyticsService } from '@/services/analyticsService';

export const HistoryPage: React.FC = () => {
  useEffect(() => {
    analyticsService.trackPageView('/history');
  }, []);

  return <Navigate to="/app" replace />;
};
