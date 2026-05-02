
export const getAssetPath = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
};
