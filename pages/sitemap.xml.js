import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';
import { generateMovieUrls } from 'utils/helpers/movieSlugs';

const Sitemap = () => {
  return null;
};

export async function getServerSideProps({ req, res }) {
  const host = req?.headers?.host || 'localhost:3000';
  const baseUrl = `https://${host}`;

  try {
    // Fetch multiple pages of popular movies for better coverage (Indian audience loves popular content)
    const moviePages = [];
    for (let page = 1; page <= 10; page++) {
      moviePages.push(
        fetch(
          `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
        ).then((r) => r.json())
      );
    }

    // Fetch other categories
    const allResponses = await Promise.all([
      ...moviePages,
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/top_rated?api_key=${TMDB_API_KEY}&page=1`,
      ).then((r) => r.json()),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/upcoming?api_key=${TMDB_API_KEY}&page=1`,
      ).then((r) => r.json()),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`,
      ).then((r) => r.json()),
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/latest?api_key=${TMDB_API_KEY}`,
      ).then((r) => r.json()),
    ]);
    
    // Separate popular movies pages from other categories
    const popularMoviesPages = allResponses.slice(0, 10);
    const topRatedMovies = allResponses[10];
    const upcomingMovies = allResponses[11];
    const nowPlayingMovies = allResponses[12];
    const latestMovies = allResponses[13];

    // Fetch genres
    const genresResponse = await fetch(
      `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/genre/movie/list?api_key=${TMDB_API_KEY}`,
    );
    const genres = await genresResponse.json();

    // Combine all movies from multiple pages
    const allMovies = [];
    popularMoviesPages.forEach((pageData) => {
      if (pageData.results) {
        allMovies.push(...pageData.results);
      }
    });
    
    // Add other categories
    if (topRatedMovies.results) allMovies.push(...topRatedMovies.results);
    if (upcomingMovies.results) allMovies.push(...upcomingMovies.results);
    if (nowPlayingMovies.results) allMovies.push(...nowPlayingMovies.results);
    if (latestMovies.id) allMovies.push(latestMovies);

    // Remove duplicates and prioritize by popularity
    const uniqueMovies = allMovies.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id),
    );

    // Sort by popularity score (vote_average * vote_count * popularity)
    const sortedMovies = uniqueMovies.sort((a, b) => {
      const scoreA = (a.vote_average || 0) * (a.vote_count || 0) * (a.popularity || 1);
      const scoreB = (b.vote_average || 0) * (b.vote_count || 0) * (b.popularity || 1);
      return scoreB - scoreA;
    });

    // Take top 2000 movies for sitemap (better coverage for Indian audience)
    const topMovies = sortedMovies.slice(0, 2000);

    // Calculate priority based on popularity for better SEO
    const calculatePriority = (movie, index) => {
      if (index < 100) return '1.0';
      if (index < 500) return '0.9';
      if (index < 1000) return '0.8';
      return '0.7';
    };

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Static Pages with High Priority -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Genre Pages - Important for Indian Audience -->
  ${genres.genres
    ?.map(
      (genre) => `
  <url>
    <loc>${baseUrl}/genre?id=${genre.id}&amp;name=${encodeURIComponent(genre.name)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('')}

  <!-- Movie Pages with Enhanced SEO URLs and Images -->
  ${topMovies
    .map((movie, index) => {
      const movieYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : '2025';
      
      const movieSlug = generateMovieUrls(movie.title, movieYear, movie.id)[0];
      const priority = calculatePriority(movie, index);
      const lastmod = movie.release_date || new Date().toISOString();
      
      // Add image sitemap data for better CTR
      const posterPath = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;
      
      const imageTag = posterPath 
        ? `
    <image:image>
      <image:loc>${posterPath}</image:loc>
      <image:title>${movie.title.replace(/&/g, '&amp;')}</image:title>
      <image:caption>${(movie.overview || movie.title).substring(0, 100).replace(/&/g, '&amp;')}</image:caption>
    </image:image>`
        : '';

      return `
  <url>
    <loc>${baseUrl}${movieSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${imageTag}
  </url>`;
    })
    .join('')}

  <!-- Paginated Movie Sitemaps for Better Indexing -->
  ${Array.from({ length: 10 }, (_, i) => `
  <sitemap>
    <loc>${baseUrl}/sitemap-movies-${i + 1}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')}

</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate',
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Fallback sitemap with basic structure
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate',
    );
    res.write(fallbackSitemap);
    res.end();
  }

  return {
    props: {},
  };
}

export default Sitemap;
