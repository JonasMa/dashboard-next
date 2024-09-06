import { NextResponse } from 'next/server';
import axios from 'axios';

const CACHE_DURATION = 30 * 60; // 30 minutes in seconds

export async function GET() {
  try {
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: process.env.OPENWEATHERMAP_CITY,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: process.env.OPENWEATHERMAP_CITY,
        appid: process.env.OPENWEATHERMAP_API_KEY,
        units: 'metric'
      }
    });

    const currentWeather = weatherResponse.data;
    const forecastList = forecastResponse.data.list;

    // Filter forecast for today
    const today = new Date().setHours(0, 0, 0, 0);
    const todayForecasts = forecastList.filter((item: any) => {
      const forecastDate = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
      return forecastDate === today;
    });

    const weatherData = {
      current: {
        temperature: currentWeather.main.temp,
        description: currentWeather.weather[0].description,
        icon: currentWeather.weather[0].icon
      },
      forecast: todayForecasts.map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }))
    };

    const response = NextResponse.json(weatherData);
    response.headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);
    return response;
  } catch (error: any) {
    console.error('Failed to fetch weather data:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    } else if (error.response?.status === 404) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch weather data', details: error.message }, { status: 500 });
    }
  }
}

export const revalidate = CACHE_DURATION;