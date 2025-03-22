// prisma/seed.ts
// import { createSlug, sanitizeHtml } from '@/app/lib/utils';
import { createSlug, sanitizeHtml } from '../app/lib/utils';
import { PrismaClient } from '@prisma/client';
// import { createSlug, sanitizeHtml } from '../src/lib/utils';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Deleted existing data');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // In a real app, this would be hashed
    },
  });

  console.log('Created test user');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest tech news and updates',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming tutorials and tips',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design principles and inspirations',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Web development tutorials and resources',
      },
    }),
  ]);

  console.log('Created categories');

  // Sample post content with HTML
  const samplePosts = [
    {
      title: 'Getting Started with Next.js',
      content: sanitizeHtml(`
        <h2>Introduction to Next.js</h2>
        <p>Next.js is a React framework that enables server-side rendering and static site generation. It's a popular choice for building modern web applications.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Server-side rendering</li>
          <li>Static site generation</li>
          <li>API routes</li>
          <li>Built-in CSS support</li>
          <li>Code splitting</li>
        </ul>
        
        <h3>Getting Started</h3>
        <p>To create a new Next.js app, you can use the following command:</p>
        
        <pre><code>npx create-next-app@latest my-app</code></pre>
        
        <p>This will set up a new Next.js project with all the necessary configurations.</p>
        
        <blockquote>Next.js provides an excellent developer experience with features like Fast Refresh.</blockquote>
      `),
      categoryIds: [categories[0].id, categories[1].id, categories[3].id],
    },
    {
      title: 'Introduction to Material UI',
      content: sanitizeHtml(`
        <h2>What is Material UI?</h2>
        <p>Material UI is a popular React UI framework that implements Google's Material Design guidelines. It provides a set of pre-built components for building user interfaces.</p>
        
        <h3>Benefits of Using Material UI</h3>
        <ul>
          <li>Comprehensive library of components</li>
          <li>Consistent design language</li>
          <li>Customizable themes</li>
          <li>Responsive layouts</li>
          <li>Active community and support</li>
        </ul>
        
        <h3>Installation</h3>
        <p>You can install Material UI using npm or yarn:</p>
        
        <pre><code>npm install @mui/material @emotion/react @emotion/styled</code></pre>
        
        <h3>Basic Example</h3>
        <p>Here's a simple example of a Material UI button:</p>
        
        <pre><code>import Button from '@mui/material/Button';

function App() {
  return (
    &lt;Button variant="contained" color="primary"&gt;
      Hello World
    &lt;/Button&gt;
  );
}</code></pre>
      `),
      categoryIds: [categories[0].id, categories[2].id, categories[3].id],
    },
    {
      title: 'Working with Prisma and PostgreSQL',
      content: sanitizeHtml(`
        <h2>Prisma: Modern Database Toolkit</h2>
        <p>Prisma is an open-source database toolkit that makes database access easy with an auto-generated query builder and type-safe queries.</p>
        
        <h3>Why Prisma?</h3>
        <ul>
          <li>Type-safe database queries</li>
          <li>Auto-generated migrations</li>
          <li>Visual data browser</li>
          <li>Intuitive data modeling</li>
          <li>Works with PostgreSQL, MySQL, SQLite, and more</li>
        </ul>
        
        <h3>Setting Up Prisma with PostgreSQL</h3>
        <p>First, install the required packages:</p>
        
        <pre><code>npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql</code></pre>
        
        <p>Create your data model in the schema.prisma file:</p>
        
        <pre><code>model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}</code></pre>
        
        <p>Generate Prisma Client and run migrations:</p>
        
        <pre><code>npx prisma migrate dev --name init</code></pre>
      `),
      categoryIds: [categories[1].id, categories[3].id],
    },
  ];

  // Create posts
  for (const postData of samplePosts) {
    const { title, content, categoryIds } = postData;
    
    const post = await prisma.post.create({
      data: {
        title,
        slug: createSlug(title),
        content,
        excerpt: content.substring(0, 150) + '...',
        published: true,
        authorId: user.id,
      },
    });
    
    // Create post-category relationships
    for (const categoryId of categoryIds) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId,
        },
      });
    }
  }

  console.log('Created sample posts');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
    console.log('Database seeding completed, connection closed');
  });