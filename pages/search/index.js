import { useEffect } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';

import Header from 'parts/Header';
import PageWrapper from 'parts/PageWrapper';
import NotFound from 'parts/NotFound';
import PaddingWrapper from 'parts/PaddingWrapper';
import MovieList from 'components/MovieList';
import Loader from 'components/UI/Loader';
import getSearchMovies from 'actions/getSearchMovies';
import clearMovies from 'actions/clearMovies';
import QUERY_PARAMS from 'utils/constants/query-params';
import LINKS from 'utils/constants/links';
import checkEmptyObject from 'utils/helpers/checkEmptyObject';

const Search = () => {
  const dispatch = useDispatch();
  const general = useSelector((state) => state.general);
  const movies = useSelector((state) => state.movies);
  const { query } = useRouter();

  const searchTerm = query[QUERY_PARAMS.SEARCH_TERM];
  const page = Number(query[QUERY_PARAMS.PAGE]);

  useEffect(() => {
    return () => {
      dispatch(clearMovies());
    };
  }, [dispatch]);

  useEffect(() => {
    if (checkEmptyObject(query)) return;

    const initialSearchTerm = Router.query[QUERY_PARAMS.SEARCH_TERM];
    const initialPage = Router.query[QUERY_PARAMS.PAGE];

    if (!initialPage) {
      const newPage = 1;
      const newSearchTerm = initialSearchTerm;
      console.log(
        '[Search useEffect] query parameter update: newSearchTerm, newPage => ',
        newSearchTerm,
        newPage,
      );
      // Router.replace({
      //   pathname: LINKS.SEARCH.HREF,
      //   query: {
      //     [QUERY_PARAMS.SEARCH_TERM]: newSearchTerm,
      //     [QUERY_PARAMS.PAGE]: newPage,
      //   },
      // });
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (!searchTerm || !page) return;

    scroll.scrollToTop({ smooth: true });

    dispatch(getSearchMovies(searchTerm, page));
  }, [searchTerm, page, dispatch]);

  if (movies.loading) {
    return <Loader />;
  } else if (movies.total_results === 0) {
    return (
      <NotFound
        title="Sorry!"
        subtitle={`There were no results for ${searchTerm}...`}
      />
    );
  } else {
    const { secure_base_url: baseUrl } = general.base.images;

    // SEO Meta Data for Search Results
    const pageTitle = `${searchTerm} - Search Results (${movies.total_results} movies found)`;
    const pageDescription = `Search results for "${searchTerm}". Found ${movies.total_results} movies. Watch trailers, read reviews, and discover movies related to ${searchTerm}.`;
    const canonicalUrl = `https://movies.zaps.dev/search?q=${encodeURIComponent(searchTerm)}${page > 1 ? `&page=${page}` : ''}`;
    const ogImage = 'https://movies.zaps.dev/movies-meta-image.jpg';

    // Enhanced keywords for search
    const keywords = `${searchTerm}, ${searchTerm} movies, ${searchTerm} trailers, watch ${searchTerm}, ${searchTerm} film, ${searchTerm} cinema, ${searchTerm} movie reviews, ${searchTerm} cast, ${searchTerm} release date, watch ${searchTerm} online, ${searchTerm} full movie, ${searchTerm} download, ${searchTerm} streaming, ${searchTerm} watch online, ${searchTerm} movie trailer, ${searchTerm} official trailer, movie search, find movies, movie database`;

    // Structured Data for Search Results
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Search Results for "${searchTerm}"`,
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
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Movie & Reviews" />
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
            <meta property="og:site_name" content="Movie & Reviews" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={pageTitle} />
            <meta property="twitter:description" content={pageDescription} />
            <meta property="twitter:image" content={ogImage} />

            {/* Additional SEO Meta Tags */}
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
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
                  href={`https://movies.zaps.dev/search?q=${encodeURIComponent(searchTerm)}&page=${page - 1}`}
                />
                <meta name="robots" content="noindex, follow" />
              </>
            )}
            {movies.results && movies.results.length > 0 && (
              <link
                rel="next"
                href={`https://movies.zaps.dev/search?q=${encodeURIComponent(searchTerm)}&page=${page + 1}`}
              />
            )}
          </Head>

          <main>
            <Header title={searchTerm} subtitle="search results" />
            <MovieList movies={movies} baseUrl={baseUrl} />
          </main>
        </PaddingWrapper>
      </PageWrapper>
    );
  }
};

export default Search;
