import { Box, Container, Typography, Link as MuiLink } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Blog Site. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Built with Next.js, MUI, and Prisma
        </Typography>
      </Container>
    </Box>
  );
}
