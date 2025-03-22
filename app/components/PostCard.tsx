// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   CardActionArea,
//   Chip,
//   Box,
// } from "@mui/material";
// import { format } from "date-fns";
// import Link from "next/link";

// type Category = {
//   id: string;
//   name: string;
//   slug: string;
// };

// type PostCardProps = {
//   id: string;
//   slug: string;
//   title: string;
//   excerpt: string;
//   createdAt: Date;
//   categories: Category[];
// };

// export default function PostCard({
//   slug,
//   title,
//   excerpt,
//   createdAt,
//   categories,
// }: PostCardProps) {
//   return (
//     <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//       <CardActionArea component={Link} href={`/post/${slug}`}>
//         <CardMedia
//           component="img"
//           height="140"
//           image={
//             slug
//               ? `https://picsum.photos/300/200?random=${slug}`
//               : "/test.jpg" // 🔹 Use a fallback image
//           }
//           alt={title}
//         />
//         <CardContent sx={{ flexGrow: 1 }}>
//           <Typography gutterBottom variant="h5" component="h2">
//             {title}
//           </Typography>
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{
//               mb: 2,
//               display: "-webkit-box",
//               overflow: "hidden",
//               WebkitBoxOrient: "vertical",
//               WebkitLineClamp: 3,
//             }}
//           >
//             {excerpt}
//           </Typography>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
//             {categories.map((category) => (
//               <Chip
//                 key={category.id}
//                 label={category.name}
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//               />
//             ))}
//           </Box>
//           <Typography variant="caption" color="text.secondary">
//             {format(new Date(createdAt), "MMMM dd, yyyy")}
//           </Typography>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// }


import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Chip,
  Box,
  useTheme,
  alpha,
  Skeleton,
} from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type PostCardProps = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  createdAt: Date;
  categories: Category[];
  featured?: boolean;
};

export default function PostCard({
  slug,
  title,
  excerpt,
  createdAt,
  categories,
  featured = false,
}: PostCardProps) {
  const theme = useTheme();
  const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: theme.shadows[6],
          '& .arrow-icon': {
            transform: 'translateX(4px)',
          }
        }
      }}
    >
      <CardActionArea 
        component={Link} 
        href={`/post/${slug}`}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          '&:hover .media-overlay': {
            opacity: 1,
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height={featured ? "220" : "180"}
            image={
              slug
                ? `https://picsum.photos/600/400?random=${slug}`
                : "/test.jpg"
            }
            alt={title}
            sx={{ 
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Box 
            className="media-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Chip
              icon={<BookmarkBorderIcon />}
              label="Read Article"
              sx={{
                bgcolor: alpha('#fff', 0.9),
                color: theme.palette.primary.main,
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: theme.palette.primary.main,
                }
              }}
            />
          </Box>
          
          {/* Category badge overlaying image */}
          {categories.length > 0 && (
            <Chip
              label={categories[0].name}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: alpha(theme.palette.background.paper, 0.85),
                color: theme.palette.primary.main,
                fontWeight: 600,
                backdropFilter: 'blur(4px)',
                fontSize: '0.75rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
          )}
        </Box>

        <CardContent 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography 
            gutterBottom 
            variant={featured ? "h4" : "h6"} 
            component="h2"
            sx={{ 
              fontWeight: 700, 
              lineHeight: 1.2,
              fontSize: featured ? '1.75rem' : '1.25rem',
              mb: 2
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              lineHeight: 1.6,
              color: alpha(theme.palette.text.secondary, 0.9)
            }}
          >
            {excerpt}
          </Typography>
          
          {categories.length > 1 && (
            <Box sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 0.8, 
              mb: 2,
              mt: 'auto'
            }}>
              {categories.slice(1).map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.light, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    borderRadius: '4px',
                    border: 'none',
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
              ))}
            </Box>
          )}
          
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              mt: 'auto',
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: alpha(theme.palette.text.secondary, 0.8),
                fontWeight: 500
              }}
            >
              {formattedDate}
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: '0.8rem'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'inherit',
                  mr: 0.5,
                  opacity: 0.9
                }}
              >
                Read
              </Typography>
              <ArrowForwardIcon 
                className="arrow-icon"
                sx={{ 
                  fontSize: '0.9rem',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}