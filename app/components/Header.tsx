import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            Blog Site
          </Typography>
          <Button
            component={Link}
            href="/"
            color="inherit"
            sx={{ mr: 1 }}
          >
            Home
          </Button>
          <Button
            component={Link}
            href="/create"
            color="inherit"
            sx={{ mr: 1 }}
          >
            Create Post
          </Button>
          <Button
            component={Link}
            href="/categories"
            color="inherit"
          >
            Categories
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
