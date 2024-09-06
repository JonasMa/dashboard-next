import React, { Suspense } from "react";
import { Box, Button } from "@mui/material";
import Link from 'next/link';
import ChecklistIcon from "@mui/icons-material/Checklist";
import WeatherWidget from "./WeatherWidget";
import NotionWidget from "./NotionWidget";
import RefreshButton from "./RefreshButton";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>
      <RefreshButton />
      <div className="widget-container">
        <Box
          className="dashboard"
          sx={{ width: "100%", maxWidth: "800px", margin: "auto" }}
        >
          <Suspense fallback={<div>Loading weather...</div>}>
            <WeatherWidget />
          </Suspense>
          <Suspense fallback={<div>Loading Notion content...</div>}>
            <NotionWidget />
          </Suspense>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Link href="/todos" passHref>
            <Button variant="contained" startIcon={<ChecklistIcon />}>
              View Todos
            </Button>
          </Link>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
