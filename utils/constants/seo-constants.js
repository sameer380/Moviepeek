export const SITE_URL = 'https://watchmoviehub.live';

// Note: INDIAN_TREND_KEYWORDS is now dynamically generated via getTrendingKeywords()
// This ensures we always have the latest trending movies from TMDB API
// See: utils/helpers/getTrendingKeywords.js

export const SEO_TEMPLATES = {
  HOME: {
    title: 'WatchMovieHub - Movie Reviews, Trailers, and News',
    description: 'Your source for the latest on movies. Find reviews, watch trailers, and get release dates for the newest films.',
  },
  MOVIE: (movie) => {
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    const overview = movie.overview?.slice(0, 155) || `Information on ${movie.title}.`;
    return {
      title: `${movie.title} (${year}) - WatchMovieHub`,
      description: `Official details for ${movie.title} (${year}). Find cast information, plot summaries, and more. ${overview}...`,
    };
  },
  CATEGORY: (category) => ({
    title: `Top ${category} Movies - WatchMovieHub`,
    description: `Discover the best ${category.toLowerCase()} movies. Browse lists, find new films, and see what's popular in the genre.`,
  }),
  TRENDING: {
    title: 'Trending Movies - Latest Blockbusters | WatchMovieHub',
    description: 'See what movies are trending now. Get the latest on popular new releases and upcoming blockbusters.',
  },
  INDIAN: {
    title: 'Indian Cinema - Bollywood & Regional Hits | WatchMovieHub',
    description: 'Explore the best of Indian cinema, including Bollywood, Tamil, Telugu, and other regional movies.',
  },
};