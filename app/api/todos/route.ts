import { NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY = process.env.CLICKUP_API_KEY;
export const revalidate = 12 * 60 * 60; // 12 hours in seconds

interface Space {
  id: string;
}

interface List {
  id: string;
}

interface Task {
  id: string;
  name: string;
  status: {
    status: string;
  } | null;
  start_date: string | null;
  due_date: string | null;
  list: {
    name: string;
  } | null;
  space: {
    name: string;
  } | null;
}

interface FormattedTask {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  due_date: string | null;
  list: string;
  space: string;
}

export async function GET() {
  try {   
    // Get all spaces in the team
    const spacesResponse = await axios.get('https://api.clickup.com/api/v2/team/9012054739/space', {
      headers: { Authorization: API_KEY },
    });

    if (!spacesResponse.data.spaces) {
      console.error('No spaces found in the response');
      return NextResponse.json({ error: 'No spaces found' }, { status: 404 });
    }

    const spaces: Space[] = spacesResponse.data.spaces;
    
    const endOfToday = new Date().setHours(23, 59, 59, 999);

    let allTasks: Task[] = [];
    // For each space, get all lists
    for (const space of spaces) {
      try {
        const listsResponse = await axios.get(`https://api.clickup.com/api/v2/space/${space.id}/list`, {
          headers: { Authorization: API_KEY },
        });

        if (listsResponse.data.lists) {
          // For each list, get tasks
          for (const list of listsResponse.data.lists as List[]) {
            const tasksResponse = await axios.get(`https://api.clickup.com/api/v2/list/${list.id}/task`, {
              headers: { Authorization: API_KEY },
              params: {
                subtasks: true,
                start_date_gt: 1, // This excludes tasks with no start date
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
      } catch (spaceError) {
        if (axios.isAxiosError(spaceError)) {
          console.error(`Error fetching lists or tasks for space ${space.id}:`, spaceError.response?.data || spaceError.message);
        } else {
          console.error(`Error fetching lists or tasks for space ${space.id}:`, (spaceError as Error).message);
        }
      }
    }

    // Filter and format tasks
    const todos: FormattedTask[] = allTasks.map(task => ({
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch todos:', error.response?.data || error.message);
      return NextResponse.json({ error: 'Failed to fetch todos', details: error.response?.data || error.message }, { status: 500 });
    } else {
      console.error('Failed to fetch todos:', (error as Error).message);
      return NextResponse.json({ error: 'Failed to fetch todos', details: (error as Error).message }, { status: 500 });
    }
  }
}