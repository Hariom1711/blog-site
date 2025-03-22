// // src/app/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { 
//   Container, 
//   Typography, 
//   Grid, 
//   Box, 
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import { useSearchParams } from 'next/navigation';
// import PostCard from './components/PostCard';
// import Pagination from './components/Pagination';
// import CategoryFilter from './components/CategoryFilter';


// type Category = {
//   id: string;
//   name: string;
//   slug: string;
// };

// type Post = {
//   id: string;
//   slug: string;
//   title: string;
//   excerpt: string;
//   createdAt: string;
//   categories: Category[];
// };

// type PaginationInfo = {
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// };

// export default function Home() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     total: 0,
//     page: 1,
//     limit: 9,
//     totalPages: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const searchParams = useSearchParams();
//   const page = parseInt(searchParams.get('page') || '1');
//   const category = searchParams.get('category');

//   useEffect(() => {
//     async function fetchPosts() {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const queryParams = new URLSearchParams();
//         queryParams.set('page', page.toString());
//         queryParams.set('limit', '9');
//         if (category) queryParams.set('category', category);
        
//         const response = await fetch(`/api/posts?${queryParams.toString()}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch posts');
//         }
        
//         const data = await response.json();
//         setPosts(data.posts);
//         setPagination(data.pagination);
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//         setError('Failed to load blog posts. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     }
    
//     fetchPosts();
//   }, [page, category]);

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h2" component="h1" sx={{ mb: 1 }}>
//           Blog
//         </Typography>
//         <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//           Explore our latest blog posts and ideas
//         </Typography>
        
//         <CategoryFilter />
        
//         {error && (
//           <Alert severity="error" sx={{ mb: 4 }}>
//             {error}
//           </Alert>
//         )}
        
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
//             <CircularProgress />
//           </Box>
//         ) : posts.length === 0 ? (
//           <Typography variant="h6" textAlign="center" sx={{ py: 10 }}>
//             No posts found for the selected category. Try another category or check back later.
//           </Typography>
//         ) : (
//           <Grid container spacing={4}>
//             {posts.map((post) => (
//               <Grid item key={post.id} xs={12} sm={6} md={4}>
//                 <PostCard {...post} />
//               </Grid>
//             ))}
//           </Grid>
//         )}
        
//         <Pagination 
//           totalPages={pagination.totalPages} 
//           currentPage={pagination.page} 
//         />
//       </Box>
//     </Container>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Alert,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useSearchParams } from 'next/navigation';
import PostCard from './components/PostCard';
import Pagination from './components/Pagination';
import CategoryFilter from './components/CategoryFilter';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  createdAt: string;
  categories: Category[];
};

type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');

  useEffect(() => {
    setActiveCategory(category);
  }, [category]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9');
        if (category) queryParams.set('category', category);
        
        const response = await fetch(`/api/posts?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [page, category]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box 
        sx={{ 
          position: 'relative',
          mb: 6,
          pb: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 800,
            background: theme.palette.mode === 'dark' ? 
              `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : 
              'inherit',
            WebkitBackgroundClip: theme.palette.mode === 'dark' ? 'text' : 'unset',
            WebkitTextFillColor: theme.palette.mode === 'dark' ? 'transparent' : 'inherit',
            mb: 2,
            letterSpacing: -0.5,
          }}
        >
          Discover Insights
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500,
              fontSize: '1.1rem',
              maxWidth: '600px',
              lineHeight: 1.5,
            }}
          >
            Explore our latest blog posts, detailed guides, and innovative ideas
          </Typography>
          
          {pagination.total > 0 && (
            <Chip 
              size="small" 
              label={`${pagination.total} articles`} 
              sx={{ 
                ml: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 600,
              }} 
            />
          )}
        </Box>
        
        <Box 
          sx={{ 
            position: { md: 'absolute' }, 
            right: 0, 
            top: { md: 10 }, 
            mb: { xs: 4, md: 0 } 
          }}
        >
          <Box 
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              fontSize: '0.875rem',
              mb: 1,
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
            <Typography variant="body2">Popular categories</Typography>
          </Box>
          <CategoryFilter activeCategory={activeCategory} />
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.1)}`
          }}
        >
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            py: 10 
          }}
        >
          <CircularProgress 
            size={40} 
            sx={{ 
              color: theme.palette.primary.main,
              mb: 2
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Loading latest articles...
          </Typography>
        </Box>
      ) : posts.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            py: 8, 
            px: 4, 
            textAlign: 'center',
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            No posts found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            No articles found for {category ? `category "${category}"` : 'the selected filters'}. 
            Try another category or check back later.
          </Typography>
          <Chip 
            icon={<AutorenewIcon />} 
            label="View all posts" 
            component="a" 
            href="/" 
            clickable 
            color="primary"
            variant="outlined"
          />
        </Paper>
      ) : (
        <Fade in={!loading} timeout={500}>
          <Grid container spacing={isMobile ? 3 : 4}>
            {posts.map((post, index) => (
              <Grid 
                item 
                key={post.id} 
                xs={12} 
                sm={6} 
                md={index === 0 ? 12 : 4}
              >
                <PostCard 
                  {...post} 
                  featured={index === 0} 
                />
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
      
      {pagination.totalPages > 1 && (
        <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            totalPages={pagination.totalPages} 
            currentPage={pagination.page} 
          />
        </Box>
      )}
    </Container>
  );
}