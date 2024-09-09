'use client';

import React from 'react';
import { Button } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';
import { refreshData } from '../lib/api';

const RefreshButton = () => {
  const router = useRouter();

  const handleRefresh = () => {
    refreshData()
      .then(() => {
        router.refresh();
      })
      .catch((error) => {
        console.error('Failed to refresh data:', error);
      });
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