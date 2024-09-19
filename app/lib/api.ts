import axios, { AxiosError } from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

const API_BASE_URL = getBaseUrl();

export async function getTodos() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/todos`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to fetch todos:', error.response?.data || error.message);
      throw new Error(error.response?.data ? JSON.stringify(error.response.data) : error.message);
    }
    throw error; // Re-throw if it's not an AxiosError
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
    const response = await axios.get(`${API_BASE_URL}/api/weather`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to fetch weather data:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
    }
    throw error; // Re-throw if it's not an AxiosError
  }
}

export async function refreshData() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/refresh`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Failed to refresh data:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to refresh data');
    }
    throw error; // Re-throw if it's not an AxiosError
  }
}

export type NotionTable = string[][];

export async function getFirstNotionTable(): Promise<NotionTable> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notion`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Notion content:', error);
    return [];
  }
}