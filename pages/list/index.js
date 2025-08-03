import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { animateScroll as scroll } from 'react-scroll';

import Header from 'parts/Header';
import NotFound from 'parts/NotFound';
import PageWrapper from 'parts/PageWrapper';
import PaddingWrapper from 'parts/PaddingWrapper';
import ListActions from 'containers/ListActions';
import MovieList from 'components/MovieList';
import Loader from 'components/UI/Loader';
import { useAuth } from 'utils/hocs/AuthProvider';
import { TMDB_API_NEW_VERSION, TMDB_IMAGE_BASE_URL } from 'config/tmdb';
import QUERY_PARAMS from 'utils/constants/query-params';
import STATUSES from 'utils/constants/statuses';
import tmdbAPI from 'services/tmdbAPI';

const List = () => {
  const { query } = useRouter();
  const { accessToken } = useAuth();

  const [status, setStatus] = useState(STATUSES.IDLE);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState(null);

  const page = Number(query[QUERY_PARAMS.PAGE]);
  const listId = query[QUERY_PARAMS.ID];

  useEffect(() => {
    (async () => {
      if (!page) return;
      if (!listId) return;

      scroll.scrollToTop({ smooth: true });

      try {
        setStatus(STATUSES.PENDING);
        const headers = accessToken
          ? {
            Authorization: `Bearer ${accessToken}`,
          }
          : {};

        const response = await tmdbAPI.get(
          `/${TMDB_API_NEW_VERSION}/list/${listId}`,
          {
            headers,
            params: {
              page,
            },
          },
        );
        const movies = response.data;
        setMovies(movies);
      } catch (error) {
        console.log('[List useEffect] error => ', error);
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [page, listId, accessToken]);

  useEffect(() => {
    if (!movies) return;
    setStatus(STATUSES.RESOLVED);
  }, [movies]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return <Loader />;
  }

  if (status === STATUSES.REJECTED) {
    return (
      <NotFound
        title="Sorry!"
        subtitle={
          error?.message ?? 'We can\'t find the page you\'re looking for...'
        }
      />
    );
  }

  if (status === STATUSES.RESOLVED) {
    // SEO Meta Data for List Page
    const listName = movies.name || 'Movie List';
    const listDescription =
      movies.description || 'A curated collection of movies.';
    const pageTitle = `${listName} - Movie Collection (${movies.total_results} movies)`;
    const pageDescription = `Browse ${listName}: ${listDescription} Collection of ${movies.total_results} movies. Watch trailers and read reviews of movies in this curated list.`;
    const canonicalUrl = `https://movies.zaps.dev/list/${listId}`;
    const ogImage = 'https://movies.zaps.dev/movies-meta-image.jpg';

    const keywords = `${listName}, ${listName} movies, ${listName} collection, ${listName} list, movie collection, curated movies, ${listName} trailers, watch ${listName} movies, ${listName} film list, movie recommendations, film collection, best movies, movie lists, watch movies online`;

    // Structured Data for Movie List
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: listName,
      description: listDescription,
      url: canonicalUrl,
      numberOfItems: movies.results?.length || 0,
      creator: {
        '@type': 'Person',
        name: movies.created_by?.name || 'Unknown',
      },
      itemListElement:
        movies.results?.map((movie, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Movie',
            name: movie.title,
            description: movie.overview,
            image: movie.poster_path
              ? `${TMDB_IMAGE_BASE_URL}w500${movie.poster_path}`
              : null,
            datePublished: movie.release_date,
            aggregateRating: movie.vote_average
              ? {
                '@type': 'AggregateRating',
                ratingValue: movie.vote_average,
                bestRating: 10,
                ratingCount: movie.vote_count,
              }
              : null,
          },
        })) || [],
    };

    return (
      <>
        <Head>
          {/* Primary Meta Tags */}
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content="Movie Trailers & Reviews" />
          <meta
            name="robots"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />

          {/* Canonical URL */}
          <link rel="canonical" href={canonicalUrl} />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="628" />
          <meta property="og:site_name" content="Movie Trailers & Reviews" />
          <meta property="og:locale" content="en_US" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={canonicalUrl} />
          <meta property="twitter:title" content={pageTitle} />
          <meta property="twitter:description" content={pageDescription} />
          <meta property="twitter:image" content={ogImage} />

          {/* Additional SEO Meta Tags */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="msapplication-TileColor" content="#000000" />

          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />

          {/* Pagination Meta Tags */}
          {page > 1 && (
            <>
              <link rel="prev" href={`${canonicalUrl}?page=${page - 1}`} />
              <meta name="robots" content="noindex, follow" />
            </>
          )}
          {movies.results && movies.results.length > 0 && (
            <link rel="next" href={`${canonicalUrl}?page=${page + 1}`} />
          )}
        </Head>

        <PageWrapper>
          <PaddingWrapper>
            <main>
              <Header title={listName} subtitle={listDescription} />
              <ListActions
                listId={listId}
                page={page}
                listName={listName}
                creatorAccountId={movies?.created_by?.id}
              />
              {movies.total_results === 0 ? (
                <NotFound title="Sorry!" subtitle="There were no items..." />
              ) : (
                <MovieList movies={movies} baseUrl={TMDB_IMAGE_BASE_URL} />
              )}
            </main>
          </PaddingWrapper>
        </PageWrapper>
      </>
    );
  }
};

export default List;
