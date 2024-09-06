import React, { Suspense } from 'react';
import WeatherWidget from './WeatherWidget';
import TodoWidget from './TodoWidget';
import NotionWidget from './NotionWidget';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>My Dashboard</h1>
      <div className="widget-container">
        <Suspense fallback={<div>Loading weather...</div>}>
          <WeatherWidget />
        </Suspense>
        <Suspense fallback={<div>Loading todos...</div>}>
          <TodoWidget />
        </Suspense>
        <Suspense fallback={<div>Loading Notion content...</div>}>
          <NotionWidget />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;