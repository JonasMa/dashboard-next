import axios from 'axios';

export async function getTodos() {
  try {
    const response = await axios.get('http://localhost:3000/api/todos');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch todos:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

export interface WeatherData {
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

export async function getWeather(): Promise<WeatherData> {
  try {
    const response = await axios.get('http://localhost:3000/api/weather');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch weather data:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
  }
}

export async function getNotionContent() {
  try {
    const response = await axios.get('http://localhost:3000/api/notion');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Notion content:', error);
    return [];
  }
}