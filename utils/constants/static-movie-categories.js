const STATIC_MOVIE_CATEGORIES = [
  { id: 'popular', name: 'Trending Now', priority: 1 },
  { id: 'now_playing', name: 'Latest Releases', priority: 2 },
  { id: 'top_rated', name: 'Top Rated', priority: 3 },
  { id: 'upcoming', name: 'Coming Soon', priority: 4 },
];

// Indian-focused movie categories for better CTR
export const INDIAN_MOVIE_CATEGORIES = [
  { id: 'popular', name: 'Trending Bollywood', keywords: ['Bollywood movies 2025', 'Hindi movies', 'trending Indian movies'] },
  { id: 'now_playing', name: 'Latest Releases', keywords: ['new movies 2025', 'latest Bollywood movies', 'new Hindi movies'] },
  { id: 'top_rated', name: 'Top Rated', keywords: ['best movies', 'top rated movies', 'highly rated movies'] },
  { id: 'upcoming', name: 'Coming Soon', keywords: ['upcoming movies', 'new releases', 'coming soon movies'] },
];

export default STATIC_MOVIE_CATEGORIES;
