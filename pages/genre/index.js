import { useEffect, useState } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';

import Header from 'parts/Header';
import PageWrapper from 'parts/PageWrapper';
import PaddingWrapper from 'parts/PaddingWrapper';
import MovieList from 'components/MovieList';
import Loader from 'components/UI/Loader';
import SortBy from 'components/SortBy';
import setSelectedMenuItemName from 'actions/setSelectedMenuItemName';
import getGenreMovies from 'actions/getGenreMovies';
import clearMovies from 'actions/clearMovies';
import { SORT_BY_OPTIONS } from 'utils/constants/select-search';
import QUERY_PARAMS from 'utils/constants/query-params';
import checkEmptyObject from 'utils/helpers/checkEmptyObject';

const Genre = () => {
  const dispatch = useDispatch();
  const general = useSelector((state) => state.general);
  const movies = useSelector((state) => state.movies);
  const { query } = useRouter();
  const [sortByOptionValue, setSortByOptionValue] = useState(
    SORT_BY_OPTIONS[0].value,
  );

  const genreId = query[QUERY_PARAMS.ID];
  const genreName = query[QUERY_PARAMS.NAME];
  const page = Number(query[QUERY_PARAMS.PAGE]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedMenuItemName());
      dispatch(clearMovies());
    };
  }, [dispatch]);

  useEffect(() => {
    if (checkEmptyObject(query)) return;

    const initialGenreId = Router.query[QUERY_PARAMS.ID];
    const initialGenreName = Router.query[QUERY_PARAMS.NAME];
    const initialPage = Router.query[QUERY_PARAMS.PAGE];

    if (!initialPage) {
      const newGenreId = initialGenreId;
      const newGenreName = initialGenreName;
      const newPage = 1;
      console.log(
        '[Genre useEffect] query parameter update: newGenreId, newGenreName, newPage => ',
        newGenreId,
        newGenreName,
        newPage,
      );
      // Router.replace({
      //   pathname: LINKS.GENRE.HREF,
      //   query: {
      //     [QUERY_PARAMS.ID]: newGenreId,
      //     [QUERY_PARAMS.NAME]: newGenreName,
      //     [QUERY_PARAMS.PAGE]: newPage,
      //   },
      // });
    }
  }, [dispatch, query]);

  useEffect(() => {
    (async () => {
      if (!genreId || !genreName || !page || !sortByOptionValue) return;

      scroll.scrollToTop({ smooth: true });

      await dispatch(setSelectedMenuItemName(genreName));
      dispatch(getGenreMovies(genreId, page, sortByOptionValue));
    })();
  }, [genreId, genreName, page, sortByOptionValue, dispatch]);

  if (movies.loading) {
    return <Loader />;
  }

  const { secure_base_url: baseUrl } = general.base.images;

  const sortByOptionValueOnChangeHandler = (newSortByOptionValue) => {
    setSortByOptionValue(newSortByOptionValue);
  };

  // SEO Meta Data
  const pageTitle = `${general.selectedMenuItemName} Movies - Page ${page}`;
  const pageDescription = `Discover the best ${general.selectedMenuItemName.toLowerCase()} movies. Browse through our curated collection of ${general.selectedMenuItemName.toLowerCase()} films, sorted by popularity, rating, and release date.`;
  const canonicalUrl = `https://movies.zaps.dev/genre?id=${genreId}&name=${encodeURIComponent(genreName)}&page=${page}`;
  const ogImage = 'https://movies.zaps.dev/movies-meta-image.jpg';

  // Structured Data for Movies
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${general.selectedMenuItemName} Movies`,
    description: pageDescription,
    url: canonicalUrl,
    numberOfItems: movies.results?.length || 0,
    itemListElement:
      movies.results?.map((movie, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Movie',
          name: movie.title,
          description: movie.overview,
          image: movie.poster_path
            ? `${baseUrl}w500${movie.poster_path}`
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
    <PageWrapper>
      <PaddingWrapper>
        <Head>
          {/* Primary Meta Tags */}
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta
            name="keywords"
            content={`${general.selectedMenuItemName.toLowerCase()}, movies, films, cinema, entertainment`}
          />
          <meta name="author" content="Next.js Movies" />
          <meta name="robots" content="index, follow" />

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
          <meta property="og:site_name" content="Next.js Movies" />
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
              <link
                rel="prev"
                href={`https://movies.zaps.dev/genre?id=${genreId}&name=${encodeURIComponent(genreName)}&page=${page - 1}`}
              />
              <meta name="robots" content="noindex, follow" />
            </>
          )}
          {movies.results && movies.results.length > 0 && (
            <link
              rel="next"
              href={`https://movies.zaps.dev/genre?id=${genreId}&name=${encodeURIComponent(genreName)}&page=${page + 1}`}
            />
          )}
        </Head>

        <main>
          <Header title={general.selectedMenuItemName} subtitle="movies" />
          <SortBy
            value={sortByOptionValue}
            onChange={sortByOptionValueOnChangeHandler}
          />
          <MovieList movies={movies} baseUrl={baseUrl} />
        </main>
      </PaddingWrapper>
    </PageWrapper>
  );
};

export default Genre;
