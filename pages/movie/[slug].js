import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';

import PageWrapper from 'parts/PageWrapper';
import Breadcrumb from 'components/Breadcrumb';
import Loader from 'components/UI/Loader';
import RecommendedMovieList from 'components/RecommendedMovieList';
import MovieSummary from 'components/MovieSummary';
import getRecommendedMovies from 'actions/getRecommendedMovies';
import clearRecommendedMovies from 'actions/clearRecommendedMovies';
import clearMovie from 'actions/clearMovie';
import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';
import { createMovieSlug, extractMovieIdFromSlug } from 'utils/helpers/movieSlugs';
import { SEO_TEMPLATES, SITE_URL, STATIC_KEYWORDS } from 'utils/constants/seo-constants';
import { APP_NAME } from 'utils/constants';

const MoviePage = ({ movie, movieId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  if (router.isFallback) {
    return <Loader />;
  }

  const general = useSelector((state) => state.general);
  const recommendedMovies = useSelector((state) => state.recommendedMovies);
  const page = 1; // Default to page 1 for recommended movies

  useEffect(() => {
    return () => {
      dispatch(clearMovie());
      dispatch(clearRecommendedMovies());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!movieId) return;

    scroll.scrollToTop({ smooth: true, delay: 500 });
    // Movie data is now from props, so we only need to fetch recommendations
    dispatch(getRecommendedMovies(movieId, page));
  }, [movieId, page, dispatch]);

  const { secure_base_url: baseUrl } = general.base?.images || { secure_base_url: 'https://image.tmdb.org/t/p/' };
  
  const seo = useMemo(() => {
    if (!movie.title) return { title: '', description: '' };
    return SEO_TEMPLATES.MOVIE(movie);
  }, [movie]);
  
  const movieTitle = movie.title || '';
  const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

  const pageKeywords = useMemo(() => {
    if (!movie.title) return STATIC_KEYWORDS;
    const movieKeywords = `${movie.title}, ${movie.title} ${movieYear}, ${movie.genres?.map(g => g.name.toLowerCase()).join(', ')}`;
    return `${movieKeywords}, ${STATIC_KEYWORDS}`;
  }, [movie, movieYear]);

  const breadcrumbItems = [
    { href: '/', text: 'Movies' },
    { href: `/movie/${router.query.slug}`, text: movie.title }
  ];

  const canonicalSlug = createMovieSlug(movieTitle, movieYear, movieId);
  const canonicalUrl = `${SITE_URL}/movie/${canonicalSlug}`;
  
  const ogImage = movie.poster_path
    ? `${baseUrl}w500${movie.poster_path}`
    : `${SITE_URL}/movies-meta-image.jpg`;

  const movieStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movieTitle,
    description: movie.overview,
    image: movie.poster_path ? `${baseUrl}w500${movie.poster_path}` : null,
    datePublished: movie.release_date,
    genre: movie.genres?.map((g) => g.name).join(', '),
    aggregateRating: movie.vote_average
      ? {
        '@type': 'AggregateRating',
        ratingValue: movie.vote_average,
        bestRating: 10,
        ratingCount: movie.vote_count,
      }
      : null,
    director: movie.credits?.crew?.find((c) => c.job === 'Director')?.name,
    actor: movie.credits?.cast?.slice(0, 10).map((actor) => actor.name),
  };

  return (
    <PageWrapper>
      <Head>
        {/* Primary Meta Tags */}
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="author" content={APP_NAME} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="video.movie" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={seo.title} />
        <meta property="twitter:description" content={seo.description} />
        <meta property="twitter:image" content={ogImage} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(movieStructuredData),
          }}
        />
      </Head>

      <main>
        <Breadcrumb items={breadcrumbItems} />
        <MovieSummary baseUrl={baseUrl} movie={movie} />
        <RecommendedMovieList
          baseUrl={baseUrl}
          recommendedMovies={recommendedMovies}
        />
      </main>
    </PageWrapper>
  );
};

// Generate static paths for SEO-optimized movies
export async function getStaticPaths() {
  try {
    const movieLists = ['popular', 'top_rated', 'upcoming', 'now_playing'];
    let allMovies = [];

    for (const list of movieLists) {
      // Fetch first 5 pages for a good variety
      for (let page = 1; page <= 5; page++) {
        const response = await fetch(
          `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/${list}?api_key=${TMDB_API_KEY}&page=${page}`
        );
        const data = await response.json();
        if (data.results) {
          allMovies.push(...data.results);
        }
      }
    }

    // Remove duplicates
    const uniqueMovies = allMovies.filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );
    
    // Pre-generate paths for the top 500 most popular movies
    const sortedMovies = uniqueMovies.sort((a, b) => b.popularity - a.popularity);
    
    const paths = sortedMovies.slice(0, 500).map((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
      const slug = createMovieSlug(movie.title, year, movie.id);
      return {
        params: { slug },
      };
    });

    return {
      paths,
      fallback: 'blocking', // Generate other pages on-demand
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

// Generate static props for each movie
export async function getStaticProps({ params }) {
  try {
    const { slug } = params;
    const movieId = extractMovieIdFromSlug(slug);

    if (!movieId) {
      return { notFound: true };
    }

    // Fetch movie data with credits and videos
    const movieResponse = await fetch(
      `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
    );

    if (!movieResponse.ok) {
      return { notFound: true };
    }

    const movie = await movieResponse.json();

    // Redirect to the canonical URL if the slug is incorrect
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    const expectedSlug = createMovieSlug(movie.title, year, movie.id);

    if (slug !== expectedSlug) {
      return {
        redirect: {
          destination: `/movie/${expectedSlug}`,
          permanent: true,
        },
      };
    }

    return {
      props: {
        movie,
        movieId,
      },
      revalidate: 86400, // Revalidate every 24 hours
    };
  } catch (error) {
    console.error('Error in getStaticProps for movie page:', error);
    return { notFound: true };
  }
}

export default MoviePage;
