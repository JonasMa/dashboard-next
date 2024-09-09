"use client";

import { useState, useEffect } from "react";
import { getWeather } from "../lib/api";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";

interface WeatherData {
  current: {
    temperature: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    time: string;
    temperature: number;
    description: string;
    icon: string;
  }>;
}

const UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes

const WeatherLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="widget weather-widget" elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Weather
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async () => {
    getWeather()
      .then((data) => {
        setWeatherData(data);
        setError(null);
      })
      .catch((err) => {
        setError("Failed to fetch weather data");
        console.error(err);
      });
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <WeatherLayout>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </WeatherLayout>
    );
  }

  if (!weatherData) {
    return (
      <WeatherLayout>
        <Typography variant="h5" component="h2" gutterBottom>
          Weather
        </Typography>
      </WeatherLayout>
    );
  }

  return (
    <WeatherLayout>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={`http://openweathermap.org/img/wn/${weatherData.current.icon}@2x.png`}
            alt={weatherData.current.description}
            sx={{ width: 60, height: 60 }}
          />
          <Box>
            <Typography variant="h4">
              {Math.round(weatherData.current.temperature)}°C
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {weatherData.current.description}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant="h6" gutterBottom>
            Today's Forecast
          </Typography>
          <Grid container spacing={2}>
            {weatherData.forecast.map((item, index) => (
              <Grid item xs={4} key={index}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body2">{item.time}</Typography>
                  <Avatar
                    src={`http://openweathermap.org/img/wn/${item.icon}.png`}
                    alt={item.description}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography variant="body2">
                    {Math.round(item.temperature)}°C
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </WeatherLayout>
  );
};

export default WeatherWidget;
