import { useState, useEffect } from 'react';
import { Box, Paper, TextField, Button, Divider, Typography } from '@mui/material';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  error = false,
  helperText = '',
}: RichTextEditorProps) {
  const [preview, setPreview] = useState(false);

  // Function to add HTML tags around selected text
  const formatText = (tag: string, attr?: string) => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newText;
    if (attr) {
      const attrValue = prompt(`Enter ${attr} URL:`);
      if (!attrValue) return;
      newText = `<${tag} ${attr}="${attrValue}">${selectedText}</${tag}>`;
    } else {
      newText = `<${tag}>${selectedText}</${tag}>`;
    }
    
    const newContent = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);
    
    onChange(newContent);
    
    // Reset selection
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newText.length);
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={() => formatText('h1')}>H1</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('h2')}>H2</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('h3')}>H3</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('p')}>P</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('strong')}>Bold</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('em')}>Italic</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('a', 'href')}>Link</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('ul')}>List</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('ol')}>Numbered List</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('li')}>List Item</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('blockquote')}>Quote</Button>
          <Button size="small" variant="outlined" onClick={() => formatText('code')}>Code</Button>
        </Box>
        
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => setPreview(!preview)}
          sx={{ mb: 2 }}
        >
          {preview ? 'Edit' : 'Preview'}
        </Button>
        
        {preview ? (
          <Box
            sx={{ 
              minHeight: 300, 
              border: '1px solid #ddd', 
              borderRadius: 1, 
              p: 2,
              '& img': { maxWidth: '100%' }
            }}
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <TextField
            id="rich-text-editor"
            fullWidth
            multiline
            minRows={12}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            helperText={helperText}
            InputProps={{
              sx: { fontFamily: 'monospace' }
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
