'use client';

import React from 'react';
import { Button } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';

const RefreshButton = () => {
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      await fetch('/api/refresh', { method: 'POST' });
      router.refresh(); // This will refresh the current route
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  return (
    <Button
      variant="text"
      startIcon={<RefreshIcon />}
      onClick={handleRefresh}
      sx={{ mb: 2 }}
    />
  );
};

export default RefreshButton;