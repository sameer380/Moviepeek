import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';

const Sitemap = () => {
  return null;
};

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://movies.zaps.dev';

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

    // Take top 200 movies for sitemap (avoid too large files)
    const topMovies = sortedMovies.slice(0, 200);

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

  <!-- Category Pages -->
  <url>
    <loc>${baseUrl}?category=Popular</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}?category=Top Rated</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}?category=Upcoming</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}?category=Now Playing</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

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

  <!-- Movie Pages with Enhanced URLs -->
  ${topMovies
    .map((movie) => {
      const movieYear = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : '';
      const movieSlug = movie.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Create multiple URL variations for better SEO
      const urls = [
        `${baseUrl}/watch-${movieSlug}-${movieYear}`,
        `${baseUrl}/movie/${movie.id}/${movieSlug}-${movieYear}`,
        `${baseUrl}/download-${movieSlug}-${movieYear}`,
        `${baseUrl}/stream-${movieSlug}-${movieYear}`,
      ];

      return urls
        .map(
          (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`,
        )
        .join('');
    })
    .join('')}


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
