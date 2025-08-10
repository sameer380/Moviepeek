/**
 * TODO:
 * https://nextjs.org/blog/next-9#automatic-partial-static-export RE: https://github.com/vercel/next.js/discussions/10874
 * Should have API abort logic when components being unmounted to avoid memory leak.
 * Should use finite states model instead of boolean loading state (at /index, /genre, /movie, /person, and /search pages).
 * Should double-check if `react-scroll` is working as expected and fix.
 */

import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// import { animateScroll as scroll } from 'react-scroll';

import Header from 'parts/Header';
import PageWrapper from 'parts/PageWrapper';
import PaddingWrapper from 'parts/PaddingWrapper';
import MovieList from 'components/MovieList';
import Loader from 'components/UI/Loader';
import setSelectedMenuItemName from 'actions/setSelectedMenuItemName';
import getStaticCategoryMovies from 'actions/getStaticCategoryMovies';
import clearMovies from 'actions/clearMovies';
import STATIC_MOVIE_CATEGORIES from 'utils/constants/static-movie-categories';
import QUERY_PARAMS from 'utils/constants/query-params';
// import LINKS from 'utils/constants/links';
// import checkEmptyObject from 'utils/helpers/checkEmptyObject';
import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';

const Home = () => {
  const dispatch = useDispatch();
  const general = useSelector((state) => state.general);
  const movies = useSelector((state) => state.movies);
  const { query } = useRouter();

  const categoryName = query[QUERY_PARAMS.CATEGORY];
  const page = Number(query[QUERY_PARAMS.PAGE]);

  useEffect(() => {
    return () => {
      dispatch(setSelectedMenuItemName());
      dispatch(clearMovies());
    };
  }, [dispatch]);


  // useEffect(() => {
  //   // MEMO: check if query parsing has finished
  //   if (Router.router.asPath !== LINKS.HOME.HREF && checkEmptyObject(query))
  //     return;

  //   const initialCategoryName = Router.query[QUERY_PARAMS.CATEGORY];
  //   const initialPage = Router.query[QUERY_PARAMS.PAGE];

  //   if (!initialCategoryName && !initialPage) {
  //     const newCategoryName = STATIC_MOVIE_CATEGORIES[0].name;
  //     const newPage = 1;
  //     console.log(
  //       '[Home useEffect - no initial category name & no initial page] query parameter update: newCategoryName, newPage => ',
  //       newCategoryName,
  //       newPage,
  //     );
  //     Router.replace({
  //       query: {
  //         [QUERY_PARAMS.CATEGORY]: newCategoryName,
  //         [QUERY_PARAMS.PAGE]: newPage,
  //       },
  //     });
  //   } else if (!initialCategoryName && initialPage) {
  //     const newCategoryName = STATIC_MOVIE_CATEGORIES[0].name;
  //     const newPage = initialPage;
  //     console.log(
  //       '[Home useEffect - no initial category name] query parameter update: newCategoryName, newPage => ',
  //       newCategoryName,
  //       newPage,
  //     );
  //     Router.replace({
  //       query: {
  //         [QUERY_PARAMS.CATEGORY]: newCategoryName,
  //         [QUERY_PARAMS.PAGE]: newPage,
  //       },
  //     });
  //   } else if (initialCategoryName && !initialPage) {
  //     const newCategoryName = initialCategoryName;
  //     const newPage = 1;
  //     console.log(
  //       '[Home useEffect - no initial page] query parameter update: newCategoryName, newPage => ',
  //       newCategoryName,
  //       newPage,
  //     );
  //     Router.replace({
  //       query: {
  //         [QUERY_PARAMS.CATEGORY]: newCategoryName,
  //         [QUERY_PARAMS.PAGE]: newPage,
  //       },
  //     });
  //   } else {
  //     console.log(
  //       '[Home useEffect - initial category name and initial page] no query parameter update',
  //     );
  //   }
  // }, [dispatch, query]);

  // useEffect(() => {
  //   (async () => {
  //     if (!categoryName || !page) return;

  //     scroll.scrollToTop({ smooth: true });

  //     await dispatch(setSelectedMenuItemName(categoryName));
  //     dispatch(getStaticCategoryMovies(categoryName, page));
  //   })();
  // }, [categoryName, page, dispatch]);


  useEffect(() => {
  // Only fetch default movies if no category/page is present
  if (!categoryName && !page) {
    dispatch(setSelectedMenuItemName(STATIC_MOVIE_CATEGORIES[0].name));
    dispatch(getStaticCategoryMovies(STATIC_MOVIE_CATEGORIES[0].name, 1));
  } else if (categoryName && page) {
    dispatch(setSelectedMenuItemName(categoryName));
    dispatch(getStaticCategoryMovies(categoryName, page));
  }
  // No redirects!
}, [dispatch, categoryName, page]);

  const { secure_base_url: baseUrl } = general.base.images;
  console.log('TMDB_API_KEY => ', TMDB_API_KEY);

  return (
    <>
      <Head>
        {/* MEMO: inspired by https://addyosmani.com/blog/preload-hero-images/ */}
        <link
          rel="preload"
          as="fetch"
          // TODO: page is hardcoded
          href={`${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/popular?api_key=${TMDB_API_KEY}&page=1`}
          crossOrigin="true"
        />
        {/* Canonical homepage without parameters */}
        <link rel="canonical" href="/" />
        <title>{`${general.selectedMenuItemName} Movies`}</title>
        
        {/* Enhanced SEO Meta Tags */}
        <meta name="description" content="Download full movies free HD quality, watch movies online streaming. Download latest movies, Hollywood movies, Bollywood movies, action movies, comedy movies, horror movies, thriller movies, romance movies, sci-fi movies, adventure movies, drama movies, animated movies, family movies, kids movies, adult movies, 18+ movies, R-rated movies, PG-13 movies, G-rated movies, blockbuster movies, box office movies, award winning movies, Oscar movies, Golden Globe movies, Cannes movies, Sundance movies, indie movies, independent movies, foreign movies, international movies, English movies, Hindi movies, Spanish movies, French movies, German movies, Italian movies, Korean movies, Japanese movies, Chinese movies, Russian movies, Arabic movies, Turkish movies, Brazilian movies, Mexican movies, Canadian movies, Australian movies, British movies, European movies, Asian movies, African movies, Latin American movies, Middle Eastern movies, Scandinavian movies, Nordic movies, Baltic movies, Eastern European movies, Western European movies, Southern European movies, Northern European movies, Central European movies, Balkan movies, Mediterranean movies, Caribbean movies, Pacific movies, Atlantic movies, Indian movies, Pakistani movies, Bangladeshi movies, Sri Lankan movies, Nepali movies, Bhutanese movies, Maldives movies, Afghan movies, Iranian movies, Iraqi movies, Syrian movies, Lebanese movies, Jordanian movies, Palestinian movies, Israeli movies, Egyptian movies, Moroccan movies, Algerian movies, Tunisian movies, Libyan movies, Sudanese movies, Ethiopian movies, Kenyan movies, Nigerian movies, Ghanaian movies, South African movies, Zimbabwean movies, Zambian movies, Malawian movies, Mozambican movies, Angolan movies, Namibian movies, Botswana movies, Lesotho movies, Swaziland movies, Madagascar movies, Mauritius movies, Seychelles movies, Comoros movies, Mayotte movies, Reunion movies, Djibouti movies, Eritrea movies, Somalia movies, Somaliland movies, Uganda movies, Tanzania movies, Rwanda movies, Burundi movies, Democratic Republic of Congo movies, Republic of Congo movies, Central African Republic movies, Chad movies, Cameroon movies, Gabon movies, Equatorial Guinea movies, Sao Tome and Principe movies, Cape Verde movies, Guinea-Bissau movies, Guinea movies, Sierra Leone movies, Liberia movies, Ivory Coast movies, Burkina Faso movies, Mali movies, Niger movies, Senegal movies, Gambia movies, Mauritania movies, Western Sahara movies, download Morocco movies, download Algeria movies, download Tunisia movies, download Libya movies, download Egypt movies, download Sudan movies, download South Sudan movies, download Ethiopia movies, download Eritrea movies, download Djibouti movies, download Somalia movies, download Somaliland movies, download Kenya movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies. Free HD movie downloads, 1080p movies download, 720p movies download, 480p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download." />
        <meta name="keywords" content="download movies free, free movie downloads, download full movies, HD movie downloads, 1080p movies download, 720p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download, download Hollywood movies, download Bollywood movies, download action movies, download comedy movies, download horror movies, download thriller movies, download romance movies, download sci-fi movies, download adventure movies, download drama movies, download animated movies, download family movies, download kids movies, download adult movies, download 18+ movies, download R-rated movies, download PG-13 movies, download G-rated movies, download blockbuster movies, download box office movies, download award winning movies, download Oscar movies, download Golden Globe movies, download Cannes movies, download Sundance movies, download indie movies, download independent movies, download foreign movies, download international movies, download English movies, download Hindi movies, download Spanish movies, download French movies, download German movies, download Italian movies, download Korean movies, download Japanese movies, download Chinese movies, download Russian movies, download Arabic movies, download Turkish movies, download Brazilian movies, download Mexican movies, download Canadian movies, download Australian movies, download British movies, download European movies, download Asian movies, download African movies, download Latin American movies, download Middle Eastern movies, download Scandinavian movies, download Nordic movies, download Baltic movies, download Eastern European movies, download Western European movies, download Southern European movies, download Northern European movies, download Central European movies, download Balkan movies, download Mediterranean movies, download Caribbean movies, download Pacific movies, download Atlantic movies, download Indian movies, download Pakistani movies, download Bangladeshi movies, download Sri Lankan movies, download Nepali movies, download Bhutanese movies, download Maldives movies, download Afghan movies, download Iranian movies, download Iraqi movies, download Syrian movies, download Lebanese movies, download Jordanian movies, download Palestinian movies, download Israeli movies, download Egyptian movies, download Moroccan movies, download Algerian movies, download Tunisian movies, download Libyan movies, download Sudanese movies, download Ethiopian movies, download Kenyan movies, download Nigerian movies, download Ghanaian movies, download South African movies, download Zimbabwean movies, download Zambian movies, download Malawian movies, download Mozambican movies, download Angolan movies, download Namibian movies, download Botswana movies, download Lesotho movies, download Swaziland movies, download Madagascar movies, download Mauritius movies, download Seychelles movies, download Comoros movies, download Mayotte movies, download Reunion movies, download Djibouti movies, download Eritrea movies, download Somalia movies, download Somaliland movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies" />
        <meta name="author" content="Movie Downloads & Streaming" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://watchmoviehub.live/" />
        <meta property="og:title" content="Movie Downloads & Streaming - Download Full Movies Free HD Quality" />
        <meta property="og:description" content="Download full movies free HD quality, watch movies online streaming. Download latest movies, Hollywood movies, Bollywood movies, action movies, comedy movies, horror movies, thriller movies, romance movies, sci-fi movies, adventure movies, drama movies, animated movies, family movies, kids movies, adult movies, 18+ movies, R-rated movies, PG-13 movies, G-rated movies, blockbuster movies, box office movies, award winning movies, Oscar movies, Golden Globe movies, Cannes movies, Sundance movies, indie movies, independent movies, foreign movies, international movies, English movies, Hindi movies, Spanish movies, French movies, German movies, Italian movies, Korean movies, Japanese movies, Chinese movies, Russian movies, Arabic movies, Turkish movies, Brazilian movies, Mexican movies, Canadian movies, Australian movies, British movies, European movies, Asian movies, African movies, Latin American movies, Middle Eastern movies, Scandinavian movies, Nordic movies, Baltic movies, Eastern European movies, Western European movies, Southern European movies, Northern European movies, Central European movies, Balkan movies, Mediterranean movies, Caribbean movies, Pacific movies, Atlantic movies, Indian movies, Pakistani movies, Bangladeshi movies, Sri Lankan movies, Nepali movies, Bhutanese movies, Maldives movies, Afghan movies, Iranian movies, Iraqi movies, Syrian movies, Lebanese movies, Jordanian movies, Palestinian movies, Israeli movies, Egyptian movies, Moroccan movies, Algerian movies, Tunisian movies, Libyan movies, Sudanese movies, Ethiopian movies, Kenyan movies, Nigerian movies, Ghanaian movies, South African movies, Zimbabwean movies, Zambian movies, Malawian movies, Mozambican movies, Angolan movies, Namibian movies, Botswana movies, Lesotho movies, Swaziland movies, Madagascar movies, Mauritius movies, Seychelles movies, Comoros movies, Mayotte movies, Reunion movies, Djibouti movies, Eritrea movies, Somalia movies, Somaliland movies, Uganda movies, Tanzania movies, Rwanda movies, Burundi movies, Democratic Republic of Congo movies, Republic of Congo movies, Central African Republic movies, Chad movies, Cameroon movies, Gabon movies, Equatorial Guinea movies, Sao Tome and Principe movies, Cape Verde movies, Guinea-Bissau movies, Guinea movies, Sierra Leone movies, Liberia movies, Ivory Coast movies, Burkina Faso movies, Mali movies, Niger movies, Senegal movies, Gambia movies, Mauritania movies, Western Sahara movies, download Morocco movies, download Algeria movies, download Tunisia movies, download Libya movies, download Egypt movies, download Sudan movies, download South Sudan movies, download Ethiopia movies, download Eritrea movies, download Djibouti movies, download Somalia movies, download Somaliland movies, download Kenya movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies. Free HD movie downloads, 1080p movies download, 720p movies download, 480p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download." />
        <meta property="og:image" content="https://watchmoviehub.live/movies-meta-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta property="og:site_name" content="Movie Trailers & Downloads" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://watchmoviehub.live/" />
        <meta property="twitter:title" content="Movie Downloads & Streaming - Download Full Movies Free HD Quality" />
        <meta property="twitter:description" content="Download full movies free HD quality, watch movies online streaming. Download latest movies, Hollywood movies, Bollywood movies, action movies, comedy movies, horror movies, thriller movies, romance movies, sci-fi movies, adventure movies, drama movies, animated movies, family movies, kids movies, adult movies, 18+ movies, R-rated movies, PG-13 movies, G-rated movies, blockbuster movies, box office movies, award winning movies, Oscar movies, Golden Globe movies, Cannes movies, Sundance movies, indie movies, independent movies, foreign movies, international movies, English movies, Hindi movies, Spanish movies, French movies, German movies, Italian movies, Korean movies, Japanese movies, Chinese movies, Russian movies, Arabic movies, Turkish movies, Brazilian movies, Mexican movies, Canadian movies, Australian movies, British movies, European movies, Asian movies, African movies, Latin American movies, Middle Eastern movies, Scandinavian movies, Nordic movies, Baltic movies, Eastern European movies, Western European movies, Southern European movies, Northern European movies, Central European movies, Balkan movies, Mediterranean movies, Caribbean movies, Pacific movies, Atlantic movies, Indian movies, Pakistani movies, Bangladeshi movies, Sri Lankan movies, Nepali movies, Bhutanese movies, Maldives movies, Afghan movies, Iranian movies, Iraqi movies, Syrian movies, Lebanese movies, Jordanian movies, Palestinian movies, Israeli movies, Egyptian movies, Moroccan movies, Algerian movies, Tunisian movies, Libyan movies, Sudanese movies, Ethiopian movies, Kenyan movies, Nigerian movies, Ghanaian movies, South African movies, Zimbabwean movies, Zambian movies, Malawian movies, Mozambican movies, Angolan movies, Namibian movies, Botswana movies, Lesotho movies, Swaziland movies, Madagascar movies, Mauritius movies, Seychelles movies, Comoros movies, Mayotte movies, Reunion movies, Djibouti movies, Eritrea movies, Somalia movies, Somaliland movies, Uganda movies, Tanzania movies, Rwanda movies, Burundi movies, Democratic Republic of Congo movies, Republic of Congo movies, Central African Republic movies, Chad movies, Cameroon movies, Gabon movies, Equatorial Guinea movies, Sao Tome and Principe movies, Cape Verde movies, Guinea-Bissau movies, Guinea movies, Sierra Leone movies, Liberia movies, Ivory Coast movies, Burkina Faso movies, Mali movies, Niger movies, Senegal movies, Gambia movies, Mauritania movies, Western Sahara movies, download Morocco movies, download Algeria movies, download Tunisia movies, download Libya movies, download Egypt movies, download Sudan movies, download South Sudan movies, download Ethiopia movies, download Eritrea movies, download Djibouti movies, download Somalia movies, download Somaliland movies, download Kenya movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies. Free HD movie downloads, 1080p movies download, 720p movies download, 480p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download." />
        <meta property="twitter:image" content="https://watchmoviehub.live/movies-meta-image.jpg" />
        <meta property="twitter:site" content="@watchmoviehub" />
        <meta property="twitter:creator" content="@watchmoviehub" />
        
        {/* Social Media Links for Trust */}
        <link rel="me" href="https://www.facebook.com/watchmoviehub" />
        <link rel="me" href="https://twitter.com/watchmoviehub" />
        <link rel="me" href="https://www.instagram.com/watchmoviehub" />
        <link rel="me" href="https://www.youtube.com/@watchmoviehub" />
        <link rel="me" href="https://www.tiktok.com/@watchmoviehub" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Movie Downloads & Streaming',
              url: 'https://watchmoviehub.live',
              logo: 'https://watchmoviehub.live/logo.png',
              description: 'Download full movies free HD quality, watch movies online streaming. Download latest movies, Hollywood movies, Bollywood movies, action movies, comedy movies, horror movies, thriller movies, romance movies, sci-fi movies, adventure movies, drama movies, animated movies, family movies, kids movies, adult movies, 18+ movies, R-rated movies, PG-13 movies, G-rated movies, blockbuster movies, box office movies, award winning movies, Oscar movies, Golden Globe movies, Cannes movies, Sundance movies, indie movies, independent movies, foreign movies, international movies, English movies, Hindi movies, Spanish movies, French movies, German movies, Italian movies, Korean movies, Japanese movies, Chinese movies, Russian movies, Arabic movies, Turkish movies, Brazilian movies, Mexican movies, Canadian movies, Australian movies, British movies, European movies, Asian movies, African movies, Latin American movies, Middle Eastern movies, Scandinavian movies, Nordic movies, Baltic movies, Eastern European movies, Western European movies, Southern European movies, Northern European movies, Central European movies, Balkan movies, Mediterranean movies, Caribbean movies, Pacific movies, Atlantic movies, Indian movies, Pakistani movies, Bangladeshi movies, Sri Lankan movies, Nepali movies, Bhutanese movies, Maldives movies, Afghan movies, Iranian movies, Iraqi movies, Syrian movies, Lebanese movies, Jordanian movies, Palestinian movies, Israeli movies, Egyptian movies, Moroccan movies, Algerian movies, Tunisian movies, Libyan movies, Sudanese movies, Ethiopian movies, Kenyan movies, Nigerian movies, Ghanaian movies, South African movies, Zimbabwean movies, Zambian movies, Malawian movies, Mozambican movies, Angolan movies, Namibian movies, Botswana movies, Lesotho movies, Swaziland movies, Madagascar movies, Mauritius movies, Seychelles movies, Comoros movies, Mayotte movies, Reunion movies, Djibouti movies, Eritrea movies, Somalia movies, Somaliland movies, Uganda movies, Tanzania movies, Rwanda movies, Burundi movies, Democratic Republic of Congo movies, Republic of Congo movies, Central African Republic movies, Chad movies, Cameroon movies, Gabon movies, Equatorial Guinea movies, Sao Tome and Principe movies, Cape Verde movies, Guinea-Bissau movies, Guinea movies, Sierra Leone movies, Liberia movies, Ivory Coast movies, Burkina Faso movies, Mali movies, Niger movies, Senegal movies, Gambia movies, Mauritania movies, Western Sahara movies, download Morocco movies, download Algeria movies, download Tunisia movies, download Libya movies, download Egypt movies, download Sudan movies, download South Sudan movies, download Ethiopia movies, download Eritrea movies, download Djibouti movies, download Somalia movies, download Somaliland movies, download Kenya movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies. Free HD movie downloads, 1080p movies download, 720p movies download, 480p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download.',
              sameAs: [
                'https://www.facebook.com/watchmoviehub',
                'https://twitter.com/watchmoviehub',
                'https://www.instagram.com/watchmoviehub',
                'https://www.youtube.com/@watchmoviehub',
                'https://www.tiktok.com/@watchmoviehub'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                url: 'https://watchmoviehub.live'
              }
            }),
          }}
        />
      </Head>
      {movies.loading ? (
        <Loader />
      ) : (
        <PageWrapper>
          <PaddingWrapper>
            <Header title={general.selectedMenuItemName} subtitle="movies" />
            <MovieList movies={movies} baseUrl={baseUrl} />
          </PaddingWrapper>
        </PageWrapper>
      )}
    </>
  );
};

export default Home;
