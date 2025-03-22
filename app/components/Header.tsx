// import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
// import Link from 'next/link';

// export default function Header() {
//   return (
//     <AppBar position="static">
//       <Container maxWidth="lg">
//         <Toolbar disableGutters>
//           <Typography
//             variant="h6"
//             noWrap
//             component={Link}
//             href="/"
//             sx={{
//               mr: 2,
//               fontWeight: 700,
//               color: 'white',
//               textDecoration: 'none',
//               flexGrow: 1,
//             }}
//           >
//             Blog Site
//           </Typography>
//           <Button
//             component={Link}
//             href="/"
//             color="inherit"
//             sx={{ mr: 1 }}
//           >
//             Home
//           </Button>
//           <Button
//             component={Link}
//             href="/create"
//             color="inherit"
//             sx={{ mr: 1 }}
//           >
//             Create Post
//           </Button>
//           <Button
//             component={Link}
//             href="/categories"
//             color="inherit"
//           >
//             Categories
//           </Button>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }



import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  useTheme, 
  alpha,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useScrollTrigger,
  Slide,
  Divider,
  useMediaQuery,
  Fab
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import CreateIcon from '@mui/icons-material/Create';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function ScrollToTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Slide in={trigger}>
        <Fab
          color="primary"
          size="small"
          onClick={handleClick}
          aria-label="scroll back to top"
          sx={{
            boxShadow: (theme) => `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Slide>
    </Box>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Create Post', href: '/create' },
    { name: 'Categories', href: '/categories' }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Blog Site
        </Typography>
        <IconButton edge="start" color="inherit" aria-label="close drawer">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.href}
              sx={{
                textAlign: 'center',
                borderRadius: 2,
                my: 0.5,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            bgcolor: theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            color: theme.palette.text.primary,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar 
              disableGutters 
              sx={{ 
                height: 70,
                justifyContent: 'space-between'
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component={Link}
                href="/"
                sx={{
                  fontWeight: 800,
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` 
                    : theme.palette.primary.main,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  letterSpacing: -0.5,
                  fontSize: { xs: '1.2rem', md: '1.4rem' }
                }}
              >
                Blog Site
              </Typography>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      component={Link}
                      href={item.href}
                      sx={{
                        color: theme.palette.text.primary,
                        mx: 1,
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}

                  <IconButton 
                    color="inherit" 
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                      }
                    }}
                  >
                    <SearchIcon />
                  </IconButton>

                  <IconButton 
                    color="inherit"
                    sx={{ 
                      ml: 1, 
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                      }
                    }}
                  >
                    <LightModeIcon />
                  </IconButton>

                  <Button
                    component={Link}
                    href="/create"
                    variant="contained"
                    startIcon={<CreateIcon />}
                    sx={{
                      ml: 2,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                      '&:hover': {
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                      }
                    }}
                  >
                    New Post
                  </Button>
                </Box>
              )}

              {/* Mobile Navigation */}
              {isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    color="inherit"
                    aria-label="search"
                    sx={{ mr: 1 }}
                  >
                    <SearchIcon />
                  </IconButton>

                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerToggle}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.15),
                      }
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderRadius: '16px 0 0 16px',
          },
        }}
      >
        {drawer}
      </Drawer>

      <ScrollToTop />
    </>
  );
}