import Link from "next/link";
import { Button, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TodoWidget from "./TodoWidget";
import RefreshButton from "../components/RefreshButton";

export default function TodosPage() {
  return (
    <Box className="todos-page" sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          justifyContent: "space-between",
        }}
      >
        <Link href="/" passHref>
          <Button startIcon={<ArrowBackIcon />} sx={{ marginRight: 2 }}>
            Back to Dashboard
          </Button>
        </Link>
        <Typography variant="h4" component="h1">
          Todos
        </Typography>
        <RefreshButton />
      </Box>
      <TodoWidget />
    </Box>
  );
}
