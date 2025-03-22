import { Pagination as MuiPagination, Box } from '@mui/material';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
};

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', page.toString());
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    
    router.push(`${pathname}${query}`);
  };

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <MuiPagination 
        count={totalPages} 
        page={currentPage} 
        onChange={handlePageChange} 
        color="primary" 
        showFirstButton 
        showLastButton
      />
    </Box>
  );
}