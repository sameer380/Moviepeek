import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';
import { generateMovieUrls } from 'utils/helpers/movieSlugs';

const Sitemap = () => {
  return null;
};

export async function getServerSideProps({ req, res }) {
  const host = req?.headers?.host || 'localhost:3000';
  const baseUrl = `https://${host}`;

  try {
    // Fetch multiple movie categories for comprehensive coverage
    const [
      popularMovies,
      topRatedMovies,
      upcomingMovies,
      nowPlayingMovies,
      latestMovies,
    ] = await Promise.all([
      fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/popular?api_key=${TMDB_API_KEY}&page=1`,
      ).then((r) => r.json()),
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

    // Fetch genres
    const genresResponse = await fetch(
      `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/genre/movie/list?api_key=${TMDB_API_KEY}`,
    );
    const genres = await genresResponse.json();

    // Combine all movies, remove duplicates, and prioritize by popularity
    const allMovies = [
      ...(popularMovies.results || []),
      ...(topRatedMovies.results || []),
      ...(upcomingMovies.results || []),
      ...(nowPlayingMovies.results || []),
    ];

    // Add latest movie if it exists
    if (latestMovies.id) {
      allMovies.push(latestMovies);
    }

    const uniqueMovies = allMovies.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.id === movie.id),
    );

    // Sort by popularity (vote_average and vote_count)
    const sortedMovies = uniqueMovies.sort((a, b) => {
      const scoreA = a.vote_average * a.vote_count || 0;
      const scoreB = b.vote_average * b.vote_count || 0;
      return scoreB - scoreA;
    });

    // Take top 1000 movies for sitemap (Vercel-friendly)
    const topMovies = sortedMovies.slice(0, 1000);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
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
  <url>
    <loc>${baseUrl}/my-lists</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Category Pages removed to avoid advertising parameterized home URLs -->

  <!-- Genre Pages -->
  ${genres.genres
    ?.map(
      (genre) => `
  <url>
    <loc>${baseUrl}/genre?id=${genre.id}&amp;name=${encodeURIComponent(genre.name)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join('')}

  <!-- Movie Pages with Enhanced SEO URLs -->
  ${topMovies
    .map((movie) => {
      const movieYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : '2024';
      
      // Generate multiple URL variations for better SEO
      const urlVariations = generateMovieUrls(movie.title, movieYear, movie.id);

      return urlVariations
        .map(
          (url) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`,
        )
        .join('');
    })
    .join('')}

  <!-- Paginated Movie Sitemaps for SEO Movies -->
  ${Array.from({ length: 5 }, (_, i) => `
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
