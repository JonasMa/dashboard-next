import Link from 'next/link';
import { Button, Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TodoWidget from '../components/TodoWidget';

export default function TodosPage() {
  return (
    <Box className="todos-page" sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Link href="/" passHref>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ marginRight: 2 }}
          >
            Back to Dashboard
          </Button>
        </Link>
        <Typography variant="h4" component="h1">
          Todos
        </Typography>
      </Box>
      <TodoWidget />
    </Box>
  );
}