import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.CLICKUP_API_KEY;
const CACHE_DURATION = 60 * 60; // 1 hour

export async function GET() {
  try {
    // Get the user's teams
    const teamsResponse = await axios.get('https://api.clickup.com/api/v2/team', {
      headers: { Authorization: API_KEY },
    });

    if (!teamsResponse.data.teams || teamsResponse.data.teams.length === 0) {
      console.error('No teams found in the response');
      return NextResponse.json({ error: 'No teams found' }, { status: 404 });
    }

    const teamId = teamsResponse.data.teams[0].id;

    let allTasks: any[] = [];

    // Get all spaces in the team
    const spacesResponse = await axios.get(`https://api.clickup.com/api/v2/team/${teamId}/space`, {
      headers: { Authorization: API_KEY },
    });

    if (!spacesResponse.data.spaces) {
      console.error('No spaces found in the response');
      return NextResponse.json({ error: 'No spaces found' }, { status: 404 });
    }

    const spaces = spacesResponse.data.spaces;

    const now = new Date();
    const endOfToday = new Date().setHours(23, 59, 59, 999);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    // For each space, get all lists
    for (const space of spaces) {
      try {
        const listsResponse = await axios.get(`https://api.clickup.com/api/v2/space/${space.id}/list`, {
          headers: { Authorization: API_KEY },
        });

        if (listsResponse.data.lists) {
          // For each list, get tasks
          for (const list of listsResponse.data.lists) {
            const tasksResponse = await axios.get(`https://api.clickup.com/api/v2/list/${list.id}/task`, {
              headers: { Authorization: API_KEY },
              params: {
                subtasks: true,
                // Get tasks with start date before now or due date after start of today
                start_date_lt: endOfToday,
                // due_date_gt: startOfToday,
              },
            });

            if (tasksResponse.data.tasks) {
              allTasks = allTasks.concat(tasksResponse.data.tasks);
            }
          }
        }
      } catch (spaceError: any) {
        console.error(`Error fetching lists or tasks for space ${space.id}:`, spaceError.response ? spaceError.response.data : spaceError.message);
      }
    }

    // Filter and format tasks
    const todos = allTasks.map(task => ({
      id: task.id,
      name: task.name,
      status: task.status ? task.status.status : 'Unknown',
      start_date: task.start_date,
      due_date: task.due_date,
      list: task.list ? task.list.name : 'No List',
      space: task.space ? task.space.name : 'Unknown Space',
    }));

    const cachedResponse = NextResponse.json(todos);
    cachedResponse.headers.set('Cache-Control', `s-maxage=${CACHE_DURATION}, stale-while-revalidate`);
    return cachedResponse;
  } catch (error: any) {
    console.error('Failed to fetch todos:', error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Failed to fetch todos', details: error.response ? error.response.data : error.message }, { status: 500 });
  }
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';