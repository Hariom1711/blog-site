'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export default function CategoriesPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form validation state
  const [nameError, setNameError] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(false);
    
    // Validate form
    if (name.trim() === '') {
      setNameError(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }
      
      await response.json();
      setSuccess(true);
      
      // Reset form
      setName('');
      setDescription('');
      
      // Refresh categories list
      fetchCategories();
      
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category. It may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4, height: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Add New Category
            </Typography>
            
            <Divider sx={{ mb: 4 }} />
            
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 4 }}>
                Category created successfully!
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(false);
                }}
                error={nameError}
                helperText={nameError ? 'Category name is required' : ''}
                disabled={loading}
                sx={{ mb: 3 }}
              />
              
              <TextField
                label="Description (optional)"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Creating...' : 'Add Category'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Categories
            </Typography>
            
            <Divider sx={{ mb: 4 }} />
            
            {loadingCategories ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : categories.length === 0 ? (
              <Alert severity="info">
                No categories found. Create your first category using the form.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {categories.map((category) => (
                  <Grid item key={category.id} xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <FolderIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6" component="div">
                            {category.name}
                          </Typography>
                        </Box>
                        
                        {category.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {category.description}
                          </Typography>
                        )}
                        
                        <Button 
                          size="small" 
                          variant="outlined" 
                          component={Link} 
                          href={`/?category=${category.slug}`}
                        >
                          View Posts
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}