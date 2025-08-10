// Utility function to create SEO-friendly slug for movies
export const createMovieSlug = (title, year, movieId) => {
  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${cleanTitle}-${year}-${movieId}`;
};

// Utility function to extract movie ID from slug
export const extractMovieIdFromSlug = (slug) => {
  // Extract the last part which should be the movie ID
  const parts = slug.split('-');
  const movieId = parts[parts.length - 1];
  return parseInt(movieId, 10);
};

// Utility function to validate if a slug is properly formatted
export const isValidMovieSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  
  const parts = slug.split('-');
  if (parts.length < 3) return false;
  
  const movieId = parts[parts.length - 1];
  return !isNaN(parseInt(movieId, 10));
};

// Utility function to generate multiple URL variations for SEO
export const generateMovieUrls = (title, year, movieId) => {
  const baseSlug = createMovieSlug(title, year, movieId);
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  
  return [
    `/movie/${baseSlug}`,
    `/watch-${cleanTitle}-${year}`,
    `/download-${cleanTitle}-${year}`,
    `/stream-${cleanTitle}-${year}`,
  ];
};
