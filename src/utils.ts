
export const getAssetPath = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Force trailing slash and handle production repo name
  const isProd = import.meta.env.PROD;
  const baseUrl = isProd ? '/metanoia/' : '/';
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return baseUrl + cleanPath;
};
