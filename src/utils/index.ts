
export const getAssetPath = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Ensure we have a leading slash for the relative part
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  
  return `${baseUrl}${cleanPath}`;
};

export * from './fileDownloader';
