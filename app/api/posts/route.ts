// import { NextRequest, NextResponse } from 'next/server';
// // import { prisma } from '@/lib/prisma';
// import DOMPurify from 'dompurify';
// import { JSDOM } from 'jsdom';
// import { prisma } from '@/app/lib/prisma';

// // Helper to sanitize HTML input
// const sanitizeHtml = (html: string) => {
//   const window = new JSDOM('').window;
//   const purify = DOMPurify(window);
//   return purify.sanitize(html, {
//     ALLOWED_TAGS: [
//       'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 
//       'strong', 'em', 'a', 'img', 'blockquote', 'code', 'pre'
//     ],
//     ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
//   });
// };
// const authorId = "cm8iqfc8g0000wdi4jxj03sqe";

// // GET all posts with pagination and filtering
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const categorySlug = searchParams.get('category');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const skip = (page - 1) * limit;

//     const where = categorySlug 
//       ? {
//           categories: {
//             some: {
//               category: {
//                 slug: categorySlug
//               }
//             }
//           },
//           published: true
//         }
//       : { published: true };

//     const [posts, total] = await Promise.all([
//       prisma.post.findMany({
//         where,
//         include: {
//           author: {
//             select: {
//               name: true,
//               email: true
//             }
//           },
//           categories: {
//             include: {
//               category: true
//             }
//           }
//         },
//         orderBy: {
//           createdAt: 'desc'
//         },
//         skip,
//         take: limit
//       }),
//       prisma.post.count({ where })
//     ]);

//     const formattedPosts = posts.map((post: { categories: any[]; }) => ({
//       ...post,
//       categories: post.categories.map(pc => pc.category)
//     }));

//     return NextResponse.json({
//       posts: formattedPosts,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit)
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch posts' },
//       { status: 500 }
//     );
//   }
// }

// // POST a new blog post
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { title, content, excerpt, categoryIds, authorId, published = false } = body;

//     // Validate inputs
//     if (!title || !content || !authorId) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Sanitize HTML content
//     const sanitizedContent = sanitizeHtml(content);
    
//     // Generate a slug from the title
//     const slug = title
//       .toLowerCase()
//       .replace(/[^\w\s]/gi, '')
//       .replace(/\s+/g, '-');

//     // Check if slug already exists
//     const existingPost = await prisma.post.findUnique({
//       where: { slug }
//     });

//     // If slug exists, add a unique suffix
//     const finalSlug = existingPost 
//       ? `${slug}-${Date.now().toString().slice(-4)}` 
//       : slug;

//     // Create the post
//     const post = await prisma.post.create({
//       data: {
//         title,
//         slug: finalSlug,
//         content: sanitizedContent,
//         excerpt: excerpt || content.substring(0, 150),
//         published,
//         authorId,
//         categories: {
//           create: categoryIds.map((categoryId: string) => ({
//             category: {
//               connect: { id: categoryId }
//             }
//           }))
//         }
//       },
//       include: {
//         categories: {
//           include: {
//             category: true
//           }
//         }
//       }
//     });

//     return NextResponse.json(post, { status: 201 });

//   } catch (error) {
//     console.error('Error creating post:', error);
//     return NextResponse.json(
//       { error: 'Failed to create post' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { prisma } from '@/app/lib/prisma';

// Helper to sanitize HTML input
const sanitizeHtml = (html: string) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 
      'strong', 'em', 'a', 'img', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
  });
};

const defaultAuthorId = "cm8iqfc8g0000wdi4jxj03sqe";

// GET all posts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where = categorySlug 
      ? {
          categories: {
            some: {
              category: { slug: categorySlug }
            }
          },
          published: true
        }
      : { published: true };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { name: true, email: true } },
          categories: { include: { category: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    const formattedPosts = posts.map((post: { categories: any[]; }) => ({
      ...post,
      categories: post.categories.map(pc => pc.category)
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, categoryIds, published = false } = body;

    // Validate inputs
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Sanitize HTML content
    const sanitizedContent = sanitizeHtml(content);
    
    // Generate a slug from the title
    const slug = title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    
    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    const finalSlug = existingPost ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        slug: finalSlug,
        content: sanitizedContent,
        excerpt: excerpt || content.substring(0, 150),
        published,
        authorId: defaultAuthorId, // Always use default author ID
        categories: {
          create: categoryIds?.map((categoryId: string) => ({
            category: { connect: { id: categoryId } }
          })) || []
        }
      },
      include: {
        categories: { include: { category: true } }
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
