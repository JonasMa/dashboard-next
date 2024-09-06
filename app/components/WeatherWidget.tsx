import { getWeather } from '../lib/api';
import { Card, CardContent, Typography, Box, Avatar, Divider, Grid } from '@mui/material';

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

const WeatherWidget = async () => {
  try {
    const weatherData: WeatherData = await getWeather();

    return (
      <Card className="widget weather-widget" elevation={3}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Weather
          </Typography>
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
              <Typography variant="h6" gutterBottom>Today's Forecast</Typography>
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
                      <Typography variant="body2">{Math.round(item.temperature)}°C</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  } catch (error: any) {
    console.error('Error in WeatherWidget:', error);
    return (
      <Card className="widget weather-widget" elevation={3}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Weather
          </Typography>
          <Typography variant="body1" color="error">
            Error loading weather: {error.message}
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default WeatherWidget;