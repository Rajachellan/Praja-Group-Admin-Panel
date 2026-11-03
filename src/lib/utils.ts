export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function parseBlogContent(rawContent: any): any {
  if (!rawContent) return rawContent;
  if (typeof rawContent === 'object') return rawContent;
  if (typeof rawContent === 'string') {
    const trimmed = rawContent.trim();
    const match = trimmed.match(/^(?:<p[^>]*>\s*)?(\{\s*(?:&quot;|")type(?:&quot;|")\s*:\s*(?:&quot;|")doc(?:&quot;|")[\s\S]*\})(?:\s*<\/p>)?$/i);
    if (match) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed && parsed.type === 'doc') return parsed;
      } catch {
        try {
          const decoded = match[1]
            .replace(/&quot;/g, '"')
            .replace(/&#39;|&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
          const parsed = JSON.parse(decoded);
          if (parsed && parsed.type === 'doc') return parsed;
        } catch {
          // Keep original HTML string if not valid Tiptap JSON
        }
      }
    }
  }
  return rawContent;
}
