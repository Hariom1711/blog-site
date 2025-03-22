import { useState, useEffect } from 'react';
import { Box, Chip, Typography, CircularProgress } from '@mui/material';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CategoryFilter() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (slug: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (slug) {
      current.set('category', slug);
    } else {
      current.delete('category');
    }
    
    // Reset to page 1 when changing categories
    if (current.has('page')) {
      current.set('page', '1');
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`${pathname}${query}`);
  };

  if (loading) {
    return <CircularProgress size={24} />;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Filter by Category</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All"
          color={!activeCategory ? 'primary' : 'default'}
          variant={!activeCategory ? 'filled' : 'outlined'}
          onClick={() => handleCategoryClick(null)}
          clickable
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            color={activeCategory === category.slug ? 'primary' : 'default'}
            variant={activeCategory === category.slug ? 'filled' : 'outlined'}
            onClick={() => handleCategoryClick(category.slug)}
            clickable
          />
        ))}
      </Box>
    </Box>
  );
}
