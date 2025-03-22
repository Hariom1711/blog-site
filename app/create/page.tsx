'use client';

import { useState, useEffect, FormEvent } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText, 
  Paper,
  Alert,
  Divider,
  CircularProgress,
  SelectChangeEvent,
  OutlinedInput,
  Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import RichTextEditor from '../components/RichTextEditor';
// import RichTextEditor from '@/components/RichTextEditor';

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  
  const router = useRouter();

  // Form validation state
  const [errors, setErrors] = useState({
    title: false,
    content: false,
    categories: false
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setFetchingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(false);
    
    // Validate form
    const newErrors = {
      title: title.trim() === '',
      content: content.trim() === '',
      categories: selectedCategories.length === 0
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(value => value)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would get the actual user ID from auth
      const authorId = 'example-user-id'; 
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          categoryIds: selectedCategories,
          authorId,
          published: true, // For simplicity, publish immediately
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }
      
      const data = await response.json();
      setSuccess(true);
      
      // Redirect to the new post after a brief delay
      setTimeout(() => {
        router.push(`/post/${data.slug}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    setErrors({ ...errors, categories: false });
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Create a New Blog Post
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 4 }}>
            Post created successfully! Redirecting...
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors({ ...errors, title: false });
            }}
            error={errors.title}
            helperText={errors.title ? 'Title is required' : ''}
            disabled={loading}
            sx={{ mb: 3 }}
          />
          
          <FormControl 
            fullWidth 
            error={errors.categories} 
            disabled={loading || fetchingCategories}
            sx={{ mb: 3 }}
          >
            <InputLabel id="categories-label">Categories</InputLabel>
            <Select
              labelId="categories-label"
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const category = categories.find(cat => cat.id === value);
                    return (
                      <Chip 
                        key={value} 
                        label={category ? category.name : value} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              )}
            >
              {fetchingCategories ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading categories...
                </MenuItem>
              ) : categories.length === 0 ? (
                <MenuItem disabled>No categories available</MenuItem>
              ) : (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.categories && <FormHelperText>Please select at least one category</FormHelperText>}
          </FormControl>
          
          <TextField
            label="Excerpt (optional)"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            disabled={loading}
            helperText="Brief summary of your post. Leave empty to generate automatically."
            sx={{ mb: 3 }}
          />
          
          <Typography variant="h6" gutterBottom>
            Content
          </Typography>
          
          <RichTextEditor
            value={content}
            onChange={setContent}
            error={errors.content}
            helperText={errors.content ? 'Content is required' : ''}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              size="large"
            >
              {loading ? 'Creating...' : 'Publish Post'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
