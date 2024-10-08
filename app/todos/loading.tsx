import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh"
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Loading Todos...
      </Typography>
    </Box>
  );
}