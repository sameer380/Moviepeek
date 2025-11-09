import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';

/**
 * Fetch trending movies from TMDB and generate dynamic keywords
 * This replaces static keyword lists with real-time trending data
 */
export async function getTrendingKeywords() {
  try {
    // Fetch multiple sources for comprehensive trending data
    const [trendingResponse, upcomingResponse, popularResponse, nowPlayingResponse] = await Promise.all([
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/trending/movie/day?api_key=${TMDB_API_KEY}&region=IN`
      ).then(r => r.json()).catch(() => ({ results: [] })),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/upcoming?api_key=${TMDB_API_KEY}&region=IN&page=1`
      ).then(r => r.json()).catch(() => ({ results: [] })),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/popular?api_key=${TMDB_API_KEY}&region=IN&page=1`
      ).then(r => r.json()).catch(() => ({ results: [] })),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/now_playing?api_key=${TMDB_API_KEY}&region=IN&page=1`
      ).then(r => r.json()).catch(() => ({ results: [] })),
    ]);

    // Combine all movies and remove duplicates
    const allMovies = [
      ...(trendingResponse.results || []),
      ...(upcomingResponse.results || []),
      ...(popularResponse.results || []),
      ...(nowPlayingResponse.results || []),
    ];

    const uniqueMovies = allMovies.filter(
      (movie, index, self) => index === self.findIndex(m => m.id === movie.id)
    );

    // Sort by popularity and get top 20 trending movies
    const topTrending = uniqueMovies
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 20)
      .map(movie => movie.title);

    // Get upcoming movies (next 30 days)
    const upcomingMovies = (upcomingResponse.results || [])
      .filter(movie => {
        if (!movie.release_date) return false;
        const releaseDate = new Date(movie.release_date);
        const today = new Date();
        const daysDiff = (releaseDate - today) / (1000 * 60 * 60 * 24);
        return daysDiff >= 0 && daysDiff <= 30;
      })
      .slice(0, 10)
      .map(movie => movie.title);

    // Generate year-based keywords
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    // Extract genres from movies (we'll need to fetch genre details separately)
    // For now, use common Indian movie genres
    const genres = [
      'Action movies',
      'Comedy movies',
      'Romance movies',
      'Thriller movies',
      'Drama movies',
      'Horror movies',
      'Adventure movies',
      'Sci-Fi movies'
    ];

    return {
      trending: topTrending,
      upcoming: upcomingMovies,
      languages: [
        'Hindi movies',
        'Tamil movies',
        'Telugu movies',
        'Malayalam movies',
        'Kannada movies',
        'Punjabi movies',
        'Bengali movies'
      ],
      genres,
      qualities: [
        '300MB movies',
        '480p movies',
        '720p movies',
        '1080p movies',
        'HD movies'
      ],
      formats: [
        'download movies',
        'watch movies online',
        'stream movies free',
        'full movie download'
      ],
      years: [
        `${currentYear} movies`,
        `${nextYear} movies`,
        `Bollywood movies ${currentYear}`,
        `Hollywood movies ${currentYear}`
      ]
    };
  } catch (error) {
    console.error('Error fetching trending keywords:', error);
    
    // Fallback to static keywords if API fails
    return {
      trending: ['Latest movies', 'Trending movies', 'Popular movies'],
      upcoming: ['Upcoming movies', 'New releases', 'Coming soon movies'],
      languages: [
        'Hindi movies',
        'Tamil movies',
        'Telugu movies',
        'Malayalam movies',
        'Kannada movies',
        'Punjabi movies',
        'Bengali movies'
      ],
      genres: [
        'Action movies',
        'Comedy movies',
        'Romance movies',
        'Thriller movies',
        'Drama movies',
        'Horror movies'
      ],
      qualities: [
        '300MB movies',
        '480p movies',
        '720p movies',
        '1080p movies',
        'HD movies'
      ],
      formats: [
        'download movies',
        'watch movies online',
        'stream movies free',
        'full movie download'
      ],
      years: []
    };
  }
}

/**
 * Get Indian-specific movies (Bollywood, South Indian)
 * Uses TMDB's discover API with Indian region and language filters
 */
export async function getIndianMovieKeywords() {
  try {
    // Fetch Indian movies using discover API with region=IN
    // Note: TMDB doesn't have perfect regional filtering, but we can filter by language
    const [hindiMovies, tamilMovies, teluguMovies] = await Promise.all([
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=hi&sort_by=popularity.desc&page=1&region=IN`
      ).then(r => r.json()).catch(() => ({ results: [] })),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=ta&sort_by=popularity.desc&page=1&region=IN`
      ).then(r => r.json()).catch(() => ({ results: [] })),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=te&sort_by=popularity.desc&page=1&region=IN`
      ).then(r => r.json()).catch(() => ({ results: [] })),
    ]);

    const indianMovies = [
      ...(hindiMovies.results || []).slice(0, 5),
      ...(tamilMovies.results || []).slice(0, 5),
      ...(teluguMovies.results || []).slice(0, 5),
    ].map(movie => movie.title);

    return {
      bollywood: (hindiMovies.results || []).slice(0, 10).map(m => m.title),
      tamil: (tamilMovies.results || []).slice(0, 10).map(m => m.title),
      telugu: (teluguMovies.results || []).slice(0, 10).map(m => m.title),
      all: indianMovies
    };
  } catch (error) {
    console.error('Error fetching Indian movie keywords:', error);
    return {
      bollywood: [],
      tamil: [],
      telugu: [],
      all: []
    };
  }
}

/**
 * Generate SEO keywords from trending movies
 * Combines movie titles with quality, format, and language keywords
 */
export function generateSEOKeywords(trendingKeywords, indianKeywords = {}) {
  const { trending, upcoming, languages, genres, qualities, formats, years } = trendingKeywords;
  
  // Combine trending movie titles with action words
  const trendingMovieKeywords = trending.map(title => 
    `${title} download, ${title} watch online, ${title} free download`
  ).join(', ');

  const upcomingMovieKeywords = upcoming.map(title =>
    `${title} upcoming, ${title} release date, ${title} trailer`
  ).join(', ');

  // Combine all keywords
  const allKeywords = [
    ...trending,
    ...upcoming,
    ...(indianKeywords.bollywood || []).slice(0, 5),
    ...languages,
    ...genres,
    ...qualities,
    ...formats,
    ...years
  ].join(', ');

  return {
    trendingMovieKeywords,
    upcomingMovieKeywords,
    allKeywords,
    trending,
    upcoming
  };
}

