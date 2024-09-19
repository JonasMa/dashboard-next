import { getTodos } from '../lib/api';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box 
} from '@mui/material';

interface Todo {
  id: string;
  name: string;
  status: string;
  start_date: string;
  due_date: string;
  list: string;
  space: string;
}

const TodoWidget = async () => {
  try {
    const todos: Todo[] = await getTodos();

    return (
      <Card className="widget todo-widget" elevation={3}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Today&apos;s Todos
          </Typography>
          {todos.length > 0 ? (
            <List>
              {todos.map((todo: Todo) => (
                <ListItem key={todo.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1" component="span">
                          {todo.name}
                        </Typography>
                        <Chip
                          label={todo.list}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No todos for today</Typography>
          )}
        </CardContent>
      </Card>
    );
  } catch (error: unknown) {
    console.error('Error in TodoWidget:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    return (
      <Card className="widget todo-widget" elevation={3}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Today&apos;s Todos
          </Typography>
          <Typography variant="body1" color="error">
            Error loading todos: {errorMessage}
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default TodoWidget;