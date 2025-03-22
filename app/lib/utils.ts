import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Configure DOMPurify with JSDOM for server-side usage
const createDOMPurify = () => {
  const window = new JSDOM('').window;
  return DOMPurify(window);
};

export const sanitizeHtml = (html: string): string => {
  const purify = createDOMPurify();
  
  return purify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
      'p', 'br', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'strong', 'em', 'b', 'i', 'u', 'strike', 'code', 'pre',
      'a', 'img', 'blockquote', 'hr', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'name',
      'target', 'rel', 'style', 'width', 'height'
    ],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true }
  });
};

// Create a slug from a string
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Get a truncated excerpt from HTML content
export const getExcerpt = (html: string, maxLength: number = 150): string => {
  // Remove HTML tags
  const text = html.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Truncate and add ellipsis if needed
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};