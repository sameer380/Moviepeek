import Head from 'next/head';

import Header from 'parts/Header';
import PageWrapper from 'parts/PageWrapper';
import PaddingWrapper from 'parts/PaddingWrapper';
import MovieList from 'components/MovieList';
import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';
import { SEO_TEMPLATES } from 'utils/constants/seo-constants';
import STATIC_MOVIE_CATEGORIES from 'utils/constants/static-movie-categories';

const Home = ({ popularMovies, trendingMovies, upcomingMovies, baseUrl }) => {
  const homeSEO = SEO_TEMPLATES.HOME;

  return (
    <>
      <Head>
        <title>{homeSEO.title}</title>
        <meta name="description" content={homeSEO.description} />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta property="og:title" content={homeSEO.title} />
        <meta property="og:description" content={homeSEO.description} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta property="twitter:title" content={homeSEO.title} />
        <meta property="twitter:description" content={homeSEO.description} />
      </Head>
      <PageWrapper>
        <PaddingWrapper>
          <Header title={STATIC_MOVIE_CATEGORIES[0].label} subtitle="movies" />
          <MovieList movies={popularMovies} baseUrl={baseUrl} />
        </PaddingWrapper>
        <PaddingWrapper>
          <Header title="Trending" subtitle="movies" />
          <MovieList movies={trendingMovies} baseUrl={baseUrl} />
        </PaddingWrapper>
        <PaddingWrapper>
          <Header title="Upcoming" subtitle="movies" />
          <MovieList movies={upcomingMovies} baseUrl={baseUrl} />
        </PaddingWrapper>
      </PageWrapper>
    </>
  );
};

const fetchMovies = async (endpoint) => {
  const response = await fetch(`${TMDB_API_BASE_URL}/${TMDB_API_VERSION}${endpoint}?api_key=${TMDB_API_KEY}&page=1`);
  const data = await response.json();
  return data.results || [];
};

export async function getStaticProps() {
  try {
    const [popularMovies, trendingMovies, upcomingMovies, config] = await Promise.all([
      fetchMovies('/movie/popular'),
      fetchMovies('/trending/movie/week'),
      fetchMovies('/movie/upcoming'),
      fetch(`${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/configuration?api_key=${TMDB_API_KEY}`).then(res => res.json())
    ]);

    const baseUrl = config.images?.secure_base_url || 'https://image.tmdb.org/t/p/';

    return {
      props: {
        popularMovies,
        trendingMovies,
        upcomingMovies,
        baseUrl,
      },
      revalidate: 3600 * 6, // Revalidate every 6 hours
    };
  } catch (error) {
    console.error('Error in getStaticProps for homepage:', error);
    return {
      props: {
        popularMovies: [],
        trendingMovies: [],
        upcomingMovies: [],
        baseUrl: 'https://image.tmdb.org/t/p/',
      },
    };
  }
}

export default Home;
