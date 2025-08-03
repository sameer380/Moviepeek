import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';

import PageWrapper from 'parts/PageWrapper';
import Loader from 'components/UI/Loader';
import RecommendedMovieList from 'components/RecommendedMovieList';
import MovieSummary from 'components/MovieSummary';
import getMovie from 'actions/getMovie';
import getRecommendedMovies from 'actions/getRecommendedMovies';
import clearRecommendedMovies from 'actions/clearRecommendedMovies';
import clearMovie from 'actions/clearMovie';
import QUERY_PARAMS from 'utils/constants/query-params';
import LINKS from 'utils/constants/links';
import checkEmptyObject from 'utils/helpers/checkEmptyObject';

const Movie = () => {
  const dispatch = useDispatch();
  const general = useSelector((state) => state.general);
  const movie = useSelector((state) => state.movie);
  const recommendedMovies = useSelector((state) => state.recommendedMovies);
  const { query } = useRouter();

  const movieId = query[QUERY_PARAMS.ID];
  const page = Number(query[QUERY_PARAMS.PAGE]);

  useEffect(() => {
    return () => {
      dispatch(clearMovie());
      dispatch(clearRecommendedMovies());
    };
  }, [dispatch]);

  useEffect(() => {
    if (checkEmptyObject(query)) return;

    const initialMovieId = Router.query[QUERY_PARAMS.ID];
    const initialPage = Router.query[QUERY_PARAMS.PAGE];

    if (!initialPage) {
      const newMovieId = initialMovieId;
      const newPage = 1;
      console.log(
        '[Movie useEffect] query parameter update: newMovieId, newPage => ',
        newMovieId,
        newPage,
      );
      Router.replace({
        pathname: LINKS.MOVIE.HREF,
        query: {
          [QUERY_PARAMS.ID]: newMovieId,
          [QUERY_PARAMS.PAGE]: newPage,
        },
      });
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (!movieId) return;

    scroll.scrollToTop({ smooth: true, delay: 500 });

    dispatch(getMovie(movieId));
  }, [movieId, dispatch]);

  useEffect(() => {
    if (!movieId || !page) return;
    dispatch(getRecommendedMovies(movieId, page));
  }, [movieId, page, dispatch]);

  if (movie.loading) {
    return <Loader />;
  }

  const { secure_base_url: baseUrl } = general.base.images;

  // Enhanced SEO Meta Data with Download Keywords
  const movieYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : '';
  const movieTitle = movie.title || 'Movie';
  const movieRating = movie.vote_average || 0;
  const movieOverview =
    movie.overview || 'Watch the latest movie trailer and read reviews.';

  // Clickbait titles with download keywords
  const clickbaitTitles = [
    `${movieTitle} (${movieYear}) - WATCH & DOWNLOAD OFFICIAL TRAILER NOW! 🎬`,
    `${movieTitle} - Download Full Movie Trailer & Watch Online (${movieYear})`,
    `WATCH ${movieTitle.toUpperCase()} - Download Movie Trailer & Stream Online!`,
    `${movieTitle} (${movieYear}) - Download Official Trailer & Watch Movie Online`,
    `${movieTitle} - Download Full Movie & Watch Trailer Online - MUST SEE! 🎥`,
  ];

  const selectedTitle =
    clickbaitTitles[Math.floor(Math.random() * clickbaitTitles.length)];

  // Enhanced description with strategic download keywords
  const pageDescription = `Watch ${movieTitle} official trailer (${movieYear}). Download ${movieTitle.toLowerCase()} movie trailer, watch online, get movie reviews, cast info, release date. ${movieRating}/10 rating. ${movieOverview} Download ${movieTitle.toLowerCase()} full movie trailer and watch online.`;

  // Strategic keywords including download terms
  const keywords = `${movieTitle}, ${movieTitle} trailer, watch ${movieTitle}, ${movieTitle} ${movieYear}, ${movieTitle} movie, ${movieTitle} reviews, ${movieTitle} cast, ${movieTitle} release date, watch ${movieTitle} online, ${movieTitle} full movie, ${movieTitle} download, ${movieTitle} streaming, ${movieTitle} watch online, ${movieTitle} movie trailer, ${movieTitle} official trailer, ${movieTitle} 2024, ${movieTitle} 2025, download movies, watch movies online, free movie trailers, download movie trailers, stream movies online, watch full movies, movie downloads, online movie streaming, free movie downloads, watch movies for free, download movie online, stream movies free, watch movies online ,download movie trailers free, hd movies`;

  const canonicalUrl = `https://movies.zaps.dev/watch-${movieTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${movieYear}`;
  const ogImage = movie.poster_path
    ? `${baseUrl}w500${movie.poster_path}`
    : 'https://movies.zaps.dev/movies-meta-image.jpg';

  // Enhanced Structured Data with Download Keywords
  const movieStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movieTitle,
    description: movieOverview,
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
    actor: movie.credits?.cast?.slice(0, 5).map((actor) => ({
      '@type': 'Person',
      name: actor.name,
      characterName: actor.character,
    })),
    trailer: {
      '@type': 'VideoObject',
      name: `${movieTitle} Official Trailer - Download & Watch Online`,
      description: `Watch and download the official trailer for ${movieTitle}. Stream ${movieTitle} online and download movie trailer.`,
      thumbnailUrl: movie.poster_path
        ? `${baseUrl}w500${movie.poster_path}`
        : null,
      uploadDate: movie.release_date,
      duration: 'PT2M30S',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      description: `Watch ${movieTitle} online and download movie trailer for free`,
    },
  };

  // Website Structured Data with Download Keywords
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Movie Trailers & Downloads',
    description:
      'Watch movie trailers, download movie trailers, read reviews, and discover the latest films. Download movies online, stream movies free, and watch full movies online.',
    url: 'https://movies.zaps.dev',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://movies.zaps.dev/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <PageWrapper>
      <Head>
        {/* Primary Meta Tags */}
        <title>{selectedTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Movie Trailers & Downloads" />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="video.movie" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={selectedTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta property="og:site_name" content="Movie Trailers & Downloads" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:video"
          content={
            movie.videos?.results?.[0]?.key
              ? `https://www.youtube.com/watch?v=${movie.videos.results[0].key}`
              : ''
          }
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={selectedTitle} />
        <meta property="twitter:description" content={pageDescription} />
        <meta property="twitter:image" content={ogImage} />

        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="application-name" content="Movie Trailers & Downloads" />
        <meta name="apple-mobile-web-app-title" content="Movie Downloads" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(movieStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </Head>

      <main>
        <MovieSummary baseUrl={baseUrl} movie={movie} />
        <RecommendedMovieList
          baseUrl={baseUrl}
          recommendedMovies={recommendedMovies}
        />
      </main>
    </PageWrapper>
  );
};

export default Movie;
