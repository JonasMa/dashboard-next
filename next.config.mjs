/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    CLICKUP_API_KEY: process.env.CLICKUP_API_KEY,
    NOTION_PAGE_ID: process.env.NOTION_PAGE_ID,
    OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY,
    OPENWEATHERMAP_CITY: process.env.OPENWEATHERMAP_CITY,
  },
}

module.exports = nextConfig