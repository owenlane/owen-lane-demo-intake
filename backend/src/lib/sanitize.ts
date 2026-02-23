import sanitizeHtml from 'sanitize-html';

export function sanitize(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const cleaned = { ...obj };
  for (const key of Object.keys(cleaned)) {
    const val = cleaned[key];
    if (typeof val === 'string') {
      (cleaned as Record<string, unknown>)[key] = sanitize(val);
    } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      (cleaned as Record<string, unknown>)[key] = sanitizeObject(val as Record<string, unknown>);
    } else if (Array.isArray(val)) {
      (cleaned as Record<string, unknown>)[key] = val.map((item) =>
        typeof item === 'string' ? sanitize(item) : item
      );
    }
  }
  return cleaned;
}
