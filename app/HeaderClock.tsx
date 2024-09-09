"use client";

import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

const HeaderClock: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const time = dateTime.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const date = dateTime.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        {time}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "#666" }}>
        {date}
      </Typography>
    </Box>
  );
};

export default HeaderClock;
