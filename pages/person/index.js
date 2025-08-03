import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { animateScroll as scroll } from 'react-scroll';

import PageWrapper from 'parts/PageWrapper';
import PersonSummary from 'components/PersonSummary';
import PersonMovieList from 'components/PersonMovieList';
import Loader from 'components/UI/Loader';
import getPerson from 'actions/getPerson';
import clearPerson from 'actions/clearPerson';
import getPersonMovies from 'actions/getPersonMovies';
import clearPersonMovies from 'actions/clearPersonMovies';
import { SORT_BY_OPTIONS } from 'utils/constants/select-search';
import QUERY_PARAMS from 'utils/constants/query-params';
import LINKS from 'utils/constants/links';
import checkEmptyObject from 'utils/helpers/checkEmptyObject';

const Person = () => {
  const dispatch = useDispatch();
  const general = useSelector((state) => state.general);
  const person = useSelector((state) => state.person);
  const personMovies = useSelector((state) => state.personMovies);
  const { query } = useRouter();
  const [sortByOptionValue, setSortByOptionValue] = useState(
    SORT_BY_OPTIONS[0].value,
  );

  const personId = query[QUERY_PARAMS.ID];
  const page = Number(query[QUERY_PARAMS.PAGE]);

  useEffect(() => {
    return () => {
      dispatch(clearPerson());
      dispatch(clearPersonMovies());
    };
  }, [dispatch]);

  useEffect(() => {
    if (checkEmptyObject(query)) return;

    const initialPersonId = Router.query[QUERY_PARAMS.ID];
    const initialPage = Router.query[QUERY_PARAMS.PAGE];

    if (!initialPage) {
      const newPersonId = initialPersonId;
      const newPage = 1;
      console.log(
        '[Movie useEffect] query parameter update: newPersonId, newPage => ',
        newPersonId,
        newPage,
      );
      Router.push({
        pathname: LINKS.PERSON.HREF,
        query: {
          [QUERY_PARAMS.ID]: newPersonId,
          [QUERY_PARAMS.PAGE]: newPage,
        },
      });
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (!personId) return;

    scroll.scrollToTop({
      smooth: true,
      delay: 500,
    });

    dispatch(getPerson(personId));
  }, [personId, dispatch]);

  useEffect(() => {
    if (!personId || !page || !sortByOptionValue) return;
    dispatch(getPersonMovies(personId, page, sortByOptionValue));
  }, [personId, page, sortByOptionValue, dispatch]);

  if (person.loading) {
    return <Loader />;
  }

  const { secure_base_url: baseUrl } = general.base.images;

  const sortByOptionValueOnChangeHandler = (newSortByOptionValue) => {
    setSortByOptionValue(newSortByOptionValue);
  };

  // SEO Meta Data for Person Page
  const personName = person.name || 'Actor';
  const personBiography =
    person.biography || 'Actor biography and filmography.';
  const personBirthday = person.birthday
    ? new Date(person.birthday).getFullYear()
    : '';
  const personDeathday = person.deathday
    ? new Date(person.deathday).getFullYear()
    : '';
  const personPlaceOfBirth = person.place_of_birth || '';

  const pageTitle = `${personName} - Movies, Biography & Filmography (${personBirthday}${personDeathday ? `-${personDeathday}` : ''})`;
  const pageDescription = `Discover ${personName}'s movies, biography, and filmography. Watch trailers of movies starring ${personName}. ${personBiography} ${personPlaceOfBirth ? `Born in ${personPlaceOfBirth}.` : ''}`;
  const canonicalUrl = `https://movies.zaps.dev/person/${personName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${personId}`;
  const ogImage = person.profile_path
    ? `${baseUrl}w500${person.profile_path}`
    : 'https://movies.zaps.dev/movies-meta-image.jpg';

  // Enhanced keywords for person search
  const keywords = `${personName}, ${personName} movies, ${personName} filmography, ${personName} biography, ${personName} actor, ${personName} actress, ${personName} films, ${personName} trailers, watch ${personName} movies, ${personName} ${personBirthday}, ${personName} ${personPlaceOfBirth}, ${personName} latest movies, ${personName} upcoming movies, ${personName} best movies, ${personName} awards, ${personName} net worth, ${personName} personal life, movie actors, film actors, celebrity profiles`;

  // Structured Data for Person
  const personStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: personName,
    description: personBiography,
    image: person.profile_path ? `${baseUrl}w500${person.profile_path}` : null,
    birthDate: person.birthday,
    deathDate: person.deathday,
    birthPlace: personPlaceOfBirth,
    jobTitle: person.known_for_department,
    alumniOf: {
      '@type': 'Organization',
      name: 'Film Industry',
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: person.known_for_department || 'Actor',
    },
  };

  // Movie List Structured Data
  const movieListStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${personName} Movies`,
    description: `Movies starring ${personName}`,
    url: canonicalUrl,
    numberOfItems: personMovies.results?.length || 0,
    itemListElement:
      personMovies.results?.map((movie, index) => ({
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
          actor: {
            '@type': 'Person',
            name: personName,
            characterName: movie.character,
          },
        },
      })) || [],
  };

  return (
    <PageWrapper>
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
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta property="og:site_name" content="Movie Trailers & Reviews" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="profile:first_name"
          content={personName.split(' ')[0]}
        />
        <meta
          property="profile:last_name"
          content={personName.split(' ').slice(1).join(' ')}
        />

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
            __html: JSON.stringify(personStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(movieListStructuredData),
          }}
        />

        {/* Pagination Meta Tags */}
        {page > 1 && (
          <>
            <link rel="prev" href={`${canonicalUrl}?page=${page - 1}`} />
            <meta name="robots" content="noindex, follow" />
          </>
        )}
        {personMovies.results && personMovies.results.length > 0 && (
          <link rel="next" href={`${canonicalUrl}?page=${page + 1}`} />
        )}
      </Head>

      <main>
        <PersonSummary baseUrl={baseUrl} person={person} />
        <PersonMovieList
          baseUrl={baseUrl}
          personMovies={personMovies}
          sortByOptionValue={sortByOptionValue}
          sortByOptionValueOnChange={sortByOptionValueOnChangeHandler}
        />
      </main>
    </PageWrapper>
  );
};

export default Person;
