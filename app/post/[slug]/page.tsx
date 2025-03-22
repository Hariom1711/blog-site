'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Chip, 
  Divider, 
  CircularProgress,
  Alert,
  Link as MuiLink,
  Paper
} from '@mui/material';
import { format } from 'date-fns';
import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Author = {
  name: string | null;
  email: string;
};

type Post = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  author: Author;
};

export default function PostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/posts/${params.slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load the blog post. It may not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ my: 4 }}>
          {error || 'Post not found'}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <MuiLink component={Link} href="/">
            Return to Home
          </MuiLink>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {post.categories.map(category => (
            <Chip
              key={category.id}
              label={category.name}
              size="small"
              color="primary"
              component={Link}
              href={`/?category=${category.slug}`}
              clickable
            />
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, color: 'text.secondary' }}>
          <Typography variant="body2" component="span">
            By {post.author.name || post.author.email}
          </Typography>
          <Typography variant="body2" component="span" sx={{ mx: 1 }}>
            •
          </Typography>
          <Typography variant="body2" component="span">
            {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
          </Typography>
          {post.updatedAt !== post.createdAt && (
            <>
              <Typography variant="body2" component="span" sx={{ mx: 1 }}>
                •
              </Typography>
              <Typography variant="body2" component="span">
                Updated {format(new Date(post.updatedAt), 'MMMM dd, yyyy')}
              </Typography>
            </>
          )}
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box 
          className="blog-content" 
          sx={{
            '& img': { maxWidth: '100%', height: 'auto' },
            '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 4, mb: 2 },
            '& p': { mb: 2 },
            '& ul, & ol': { mb: 2, pl: 4 },
            '& blockquote': { 
              borderLeft: '4px solid', 
              borderColor: 'primary.main',
              pl: 2,
              py: 1,
              my: 2,
              fontStyle: 'italic',
              bgcolor: 'background.paper'
            },
            '& pre': { 
              p: 2, 
              my: 2, 
              bgcolor: 'grey.100',
              overflow: 'auto',
              borderRadius: 1
            },
            '& code': {
              p: 0.5,
              bgcolor: 'grey.100',
              borderRadius: 0.5,
              fontFamily: 'monospace'
            }
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Paper>
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <MuiLink component={Link} href="/" underline="hover">
          ← Back to all posts
        </MuiLink>
      </Box>
    </Container>
  );
}