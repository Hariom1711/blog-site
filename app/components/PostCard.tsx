import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Chip,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import Link from "next/link";

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
};

export default function PostCard({
  slug,
  title,
  excerpt,
  createdAt,
  categories,
}: PostCardProps) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea component={Link} href={`/post/${slug}`}>
        <CardMedia
          component="img"
          height="140"
          image={
            slug
              ? `https://picsum.photos/300/200?random=${slug}`
              : "/test.jpg" // 🔹 Use a fallback image
          }
          alt={title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
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
            }}
          >
            {excerpt}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(createdAt), "MMMM dd, yyyy")}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
