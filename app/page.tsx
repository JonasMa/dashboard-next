import React, { Suspense } from "react";
import { Box, Button, Paper, Stack } from "@mui/material";
import Link from 'next/link';
import ChecklistIcon from "@mui/icons-material/Checklist";
import WeatherWidget from "./WeatherWidget";
import NotionWidget from "./NotionWidget";
import RefreshButton from "./components/RefreshButton";
import HeaderClock from "./HeaderClock";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Box className="dashboard" sx={{ 
        maxWidth: 1200, 
        margin: 'auto', 
        padding: 3,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <HeaderClock />
            <RefreshButton />
          </Box>
          <Stack direction="row" spacing={3}>
            <Box flex={1}>
              <Suspense fallback={<Paper elevation={1} sx={{ padding: 2, textAlign: 'center' }}>Loading weather...</Paper>}>
                <WeatherWidget />
              </Suspense>
            </Box>
            <Box flex={1}>
              <Suspense fallback={<Paper elevation={1} sx={{ padding: 2, textAlign: 'center' }}>Loading Notion content...</Paper>}>
                <NotionWidget />
              </Suspense>
            </Box>
          </Stack>
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Link href="/todos" passHref>
            <Button 
              variant="contained" 
              startIcon={<ChecklistIcon />}
              sx={{ 
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#115293',
                },
              }}
            >
              View Todos
            </Button>
          </Link>
        </Box>
      </Box>
    </main>
  );
}