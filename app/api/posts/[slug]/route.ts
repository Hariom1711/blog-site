// //app/api/posts/[slug]/route.ts
// import { prisma } from '@/app/lib/prisma';
// import { NextRequest, NextResponse } from 'next/server';
// // import { prisma } from '@/lib/prisma';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { slug: string } }
// ) {
//   try {
//     const { slug } = params;

//     const post = await prisma.post.findUnique({
//       where: { slug },
//       include: {
//         author: {
//           select: {
//             name: true,
//             email: true
//           }
//         },
//         categories: {
//           include: {
//             category: true
//           }
//         }
//       }
//     });

//     if (!post) {
//       return NextResponse.json(
//         { error: 'Post not found' },
//         { status: 404 }
//       );
//     }

//     // Format categories
//     const formattedPost = {
//       ...post,
//       categories: post.categories.map((pc: { category: any; }) => pc.category)
//     };

//     return NextResponse.json(formattedPost);

//   } catch (error) {
//     console.error('Error fetching post:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch post' },
//       { status: 500 }
//     );
//   }
// }
import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
): Promise<NextResponse> {
  try {
    const { params } = context; // Extract params properly
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, email: true } },
        categories: { include: { category: true } }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const formattedPost = {
      ...post,
      categories: post.categories.map((pc) => pc.category)
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
