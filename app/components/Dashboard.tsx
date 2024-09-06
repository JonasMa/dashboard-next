import React, { Suspense } from "react";
import WeatherWidget from "./WeatherWidget";
import TodoWidget from "./TodoWidget";
import NotionWidget from "./NotionWidget";
import { Box, Button, Link } from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>
      <div className="widget-container">
        {/* <Suspense fallback={<div>Loading weather...</div>}>
          <WeatherWidget />
        </Suspense>
        <Suspense fallback={<div>Loading todos...</div>}>
          <TodoWidget />
        </Suspense>
        <Suspense fallback={<div>Loading Notion content...</div>}>
          <NotionWidget />
        </Suspense> */}
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
          <Link href="/todos" component="a">
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
