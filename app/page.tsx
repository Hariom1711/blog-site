// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Alert
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import PostCard from './components/PostCard';
import Pagination from './components/Pagination';
import CategoryFilter from './components/CategoryFilter';


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
  
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');

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
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" sx={{ mb: 1 }}>
          Blog
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Explore our latest blog posts and ideas
        </Typography>
        
        <CategoryFilter />
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography variant="h6" textAlign="center" sx={{ py: 10 }}>
            No posts found for the selected category. Try another category or check back later.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <PostCard {...post} />
              </Grid>
            ))}
          </Grid>
        )}
        
        <Pagination 
          totalPages={pagination.totalPages} 
          currentPage={pagination.page} 
        />
      </Box>
    </Container>
  );
}