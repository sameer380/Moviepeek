import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';
import { generateMovieUrls } from 'utils/helpers/movieSlugs';

const SitemapMovies = () => {
  return null;
};

export async function getServerSideProps({ req, res, params }) {
  const host = req?.headers?.host || 'localhost:3000';
  const baseUrl = `https://${host}`;
  const { page } = params;
  const pageNum = parseInt(page, 10);

  try {
    // Fetch different movie categories based on page number
    let endpoint = '';
    let actualPage = pageNum;
    
    if (pageNum <= 10) {
      // Pages 1-10: Popular movies
      endpoint = 'popular';
    } else if (pageNum <= 15) {
      // Pages 11-15: Upcoming movies
      endpoint = 'upcoming';
      actualPage = pageNum - 10;
    } else if (pageNum <= 20) {
      // Pages 16-20: Now playing
      endpoint = 'now_playing';
      actualPage = pageNum - 15;
    } else if (pageNum <= 25) {
      // Pages 21-25: Top rated
      endpoint = 'top_rated';
      actualPage = pageNum - 20;
    } else {
      res.statusCode = 404;
      res.end('Not found');
      return { props: {} };
    }
    
    const response = await fetch(
      `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/${endpoint}?api_key=${TMDB_API_KEY}&page=${actualPage}`
    );
    const movies = await response.json();

    if (!movies.results || movies.results.length === 0) {
      res.statusCode = 404;
      res.end('Not found');
      return { props: {} };
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${movies.results
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
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate',
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Error generating movie sitemap:', error);
    res.statusCode = 500;
    res.end('Error generating sitemap');
  }

  return {
    props: {},
  };
}

export default SitemapMovies;
