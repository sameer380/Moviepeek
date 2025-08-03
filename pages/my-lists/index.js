import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { animateScroll as scroll } from 'react-scroll';

import Header from 'parts/Header';
import NotFound from 'parts/NotFound';
import PageWrapper from 'parts/PageWrapper';
import PaddingWrapper from 'parts/PaddingWrapper';
import MyTMDBLists from 'components/MyTMDBLists';
import Loader from 'components/UI/Loader';
import withAuth from 'utils/hocs/withAuth';
import { TMDB_API_NEW_VERSION, TMDB_IMAGE_BASE_URL } from 'config/tmdb';
import QUERY_PARAMS from 'utils/constants/query-params';
import STATUSES from 'utils/constants/statuses';
import tmdbAPI from 'services/tmdbAPI';

const MyLists = ({ accountId, accessToken }) => {
  const { query } = useRouter();

  const [status, setStatus] = useState(STATUSES.IDLE);
  const [error, setError] = useState(null);
  const [myLists, setMyLists] = useState(null);

  const page = Number(query[QUERY_PARAMS.PAGE]);

  useEffect(() => {
    (async () => {
      if (!page) return;
      if (!accountId) return;
      if (!accessToken) return;

      scroll.scrollToTop({ smooth: true });

      try {
        setStatus(STATUSES.PENDING);
        const response = await tmdbAPI.get(
          `/${TMDB_API_NEW_VERSION}/account/${accountId}/lists`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page,
            },
          },
        );
        const myLists = response.data;
        setMyLists(myLists);
      } catch (error) {
        console.log('[MyLists useEffect] error => ', error);
        setStatus(STATUSES.REJECTED);
        setError(error);
      }
    })();
  }, [page, accountId, accessToken]);

  useEffect(() => {
    if (!myLists) return;
    setStatus(STATUSES.RESOLVED);
  }, [myLists]);

  if (status === STATUSES.IDLE || status === STATUSES.PENDING) {
    return <Loader />;
  }

  if (status === STATUSES.REJECTED) {
    return (
      <NotFound
        title="Sorry!"
        subtitle={error?.message ?? 'There were no my lists...'}
      />
    );
  }

  if (status === STATUSES.RESOLVED) {
    // SEO Meta Data for My Lists
    const pageTitle = 'My Movie Lists - Personal Collections & Favorites';
    const pageDescription =
      'Manage your personal movie lists and collections. Create custom lists, save your favorite movies, and organize your film collection. Access your TMDB movie lists and personal recommendations.';
    const canonicalUrl = 'https://movies.zaps.dev/my-lists';
    const ogImage = 'https://movies.zaps.dev/movies-meta-image.jpg';

    const keywords =
      'my movie lists, personal movie collections, favorite movies, custom movie lists, TMDB lists, movie recommendations, personal film collection, save movies, watchlist, movie favorites, personal movie database, organize movies, movie lists, film collections';

    // Structured Data for Lists
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'My Movie Lists',
      description: pageDescription,
      url: canonicalUrl,
      numberOfItems: myLists.results?.length || 0,
      itemListElement:
        myLists.results?.map((list, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: list.name,
            description: list.description,
            creator: {
              '@type': 'Person',
              name: 'User',
            },
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
          <meta name="robots" content="noindex, nofollow" />

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
        </Head>

        <PageWrapper>
          <PaddingWrapper>
            <main>
              <Header title="My Lists" subtitle="TMDB" />
              <MyTMDBLists myLists={myLists} baseUrl={TMDB_IMAGE_BASE_URL} />
            </main>
          </PaddingWrapper>
        </PageWrapper>
      </>
    );
  }
};

export default withAuth(MyLists);
