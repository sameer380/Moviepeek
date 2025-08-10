import { useEffect } from 'react';
import { useRouter } from 'next/router';
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
import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_API_VERSION } from 'config/tmdb';
import { createMovieSlug, extractMovieIdFromSlug } from 'utils/helpers/movieSlugs';

const MoviePage = () => {
  const dispatch = useDispatch();
  const general = useSelector((state) => state.general);
  const movie = useSelector((state) => state.movie);
  const recommendedMovies = useSelector((state) => state.recommendedMovies);
  const router = useRouter();
  const { slug } = router.query;

  const movieId = slug ? extractMovieIdFromSlug(slug) : null;
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
    dispatch(getMovie(movieId));
  }, [movieId, dispatch]);

  useEffect(() => {
    if (!movieId) return;
    dispatch(getRecommendedMovies(movieId, page));
  }, [movieId, page, dispatch]);

  // Show loading while fetching movie data
  if (movie.loading || !movieId) {
    return <Loader />;
  }

  // If movie not found, redirect to 404
  if (movie.error || !movie.title) {
    router.push('/404');
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

  // High-volume download keywords titles
  const clickbaitTitles = [
    `${movieTitle} (${movieYear}) - DOWNLOAD FULL MOVIE FREE HD QUALITY 🎬`,
    `${movieTitle} - Download Movie Free HD 1080p (${movieYear})`,
    `DOWNLOAD ${movieTitle.toUpperCase()} FULL MOVIE - FREE HD STREAMING!`,
    `${movieTitle} (${movieYear}) - Download Full Movie Online Free HD`,
    `${movieTitle} - Download Movie Free HD Quality - WATCH ONLINE! 🎥`,
  ];

  const selectedTitle =
    clickbaitTitles[Math.floor(Math.random() * clickbaitTitles.length)];

  // High-volume download keywords description
  const pageDescription = `Download ${movieTitle} full movie free HD quality (${movieYear}). Watch ${movieTitle.toLowerCase()} online free, download movie HD 1080p, 720p, 480p. ${movieRating}/10 rating. ${movieOverview} Download ${movieTitle.toLowerCase()} full movie free HD quality, watch online streaming.`;

  // High-volume movie download keywords (most searched daily)
  const keywords = `${movieTitle}, download ${movieTitle} full movie, ${movieTitle} download, ${movieTitle} full movie download, download ${movieTitle} free, ${movieTitle} free download, ${movieTitle} HD download, download ${movieTitle} HD, ${movieTitle} 1080p download, ${movieTitle} 720p download, ${movieTitle} 480p download, ${movieTitle} movie download, download ${movieTitle} movie, ${movieTitle} online, watch ${movieTitle} online, ${movieTitle} streaming, ${movieTitle} watch online, ${movieTitle} full movie online, ${movieTitle} free online, ${movieTitle} HD online, ${movieTitle} 2024, ${movieTitle} 2025, download movies free, free movie downloads, download full movies, HD movie downloads, 1080p movies download, 720p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download, download Hollywood movies, download Bollywood movies, download action movies, download comedy movies, download horror movies, download thriller movies, download romance movies, download sci-fi movies, download adventure movies, download drama movies, download animated movies, download family movies, download kids movies, download adult movies, download 18+ movies, download R-rated movies, download PG-13 movies, download G-rated movies, download blockbuster movies, download box office movies, download award winning movies, download Oscar movies, download Golden Globe movies, download Cannes movies, download Sundance movies, download indie movies, download independent movies, download foreign movies, download international movies, download English movies, download Hindi movies, download Spanish movies, download French movies, download German movies, download Italian movies, download Korean movies, download Japanese movies, download Chinese movies, download Russian movies, download Arabic movies, download Turkish movies, download Brazilian movies, download Mexican movies, download Canadian movies, download Australian movies, download British movies, download European movies, download Asian movies, download African movies, download Latin American movies, download Middle Eastern movies, download Scandinavian movies, download Nordic movies, download Baltic movies, download Eastern European movies, download Western European movies, download Southern European movies, download Northern European movies, download Central European movies, download Balkan movies, download Mediterranean movies, download Caribbean movies, download Pacific movies, download Atlantic movies, download Indian movies, download Pakistani movies, download Bangladeshi movies, download Sri Lankan movies, download Nepali movies, download Bhutanese movies, download Maldives movies, download Afghan movies, download Iranian movies, download Iraqi movies, download Syrian movies, download Lebanese movies, download Jordanian movies, download Palestinian movies, download Israeli movies, download Egyptian movies, download Moroccan movies, download Algerian movies, download Tunisian movies, download Libyan movies, download Sudanese movies, download Ethiopian movies, download Kenyan movies, download Nigerian movies, download Ghanaian movies, download South African movies, download Zimbabwean movies, download Zambian movies, download Malawian movies, download Mozambican movies, download Angolan movies, download Namibian movies, download Botswana movies, download Lesotho movies, download Swaziland movies, download Madagascar movies, download Mauritius movies, download Seychelles movies, download Comoros movies, download Mayotte movies, download Reunion movies, download Djibouti movies, download Eritrea movies, download Somalia movies, download Somaliland movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies, download Morocco movies, download Algeria movies, download Tunisia movies, download Libya movies, download Egypt movies, download Sudan movies, download South Sudan movies, download Ethiopia movies, download Eritrea movies, download Djibouti movies, download Somalia movies, download Somaliland movies, download Kenya movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies`;

  // Create canonical URL using the SEO-friendly slug
  const canonicalSlug = createMovieSlug(movieTitle, movieYear, movieId);
  const canonicalUrl = `https://watchmoviehub.live/movie/${canonicalSlug}`;
  
  const ogImage = movie.poster_path
    ? `${baseUrl}w500${movie.poster_path}`
    : 'https://watchmoviehub.live/movies-meta-image.jpg';

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
       name: `${movieTitle} Full Movie - Download Free HD Quality`,
       description: `Download ${movieTitle} full movie free HD quality. Watch ${movieTitle} online streaming and download movie.`,
       thumbnailUrl: movie.poster_path
         ? `${baseUrl}w500${movie.poster_path}`
         : null,
       uploadDate: movie.release_date,
       duration: 'PT2H30M',
     },
         offers: {
       '@type': 'Offer',
       availability: 'https://schema.org/InStock',
       price: '0',
       priceCurrency: 'USD',
       description: `Download ${movieTitle} full movie free HD quality and watch online streaming`,
     },
  };

     // Website Structured Data with Movie Download Keywords
   const websiteStructuredData = {
     '@context': 'https://schema.org',
     '@type': 'WebSite',
     name: 'Movie Downloads & Streaming',
     description:
       'Download full movies free HD quality, watch movies online streaming. Download latest movies, Hollywood movies, Bollywood movies, action movies, comedy movies, horror movies, thriller movies, romance movies, sci-fi movies, adventure movies, drama movies, animated movies, family movies, kids movies, adult movies, 18+ movies, R-rated movies, PG-13 movies, G-rated movies, blockbuster movies, box office movies, award winning movies, Oscar movies, Golden Globe movies, Cannes movies, Sundance movies, indie movies, independent movies, foreign movies, international movies, English movies, Hindi movies, Spanish movies, French movies, German movies, Italian movies, Korean movies, Japanese movies, Chinese movies, Russian movies, Arabic movies, Turkish movies, Brazilian movies, Mexican movies, Canadian movies, Australian movies, British movies, European movies, Asian movies, African movies, Latin American movies, Middle Eastern movies, Scandinavian movies, Nordic movies, Baltic movies, Eastern European movies, Western European movies, Southern European movies, Northern European movies, Central European movies, Balkan movies, Mediterranean movies, Caribbean movies, Pacific movies, Atlantic movies, Indian movies, Pakistani movies, Bangladeshi movies, Sri Lankan movies, Nepali movies, Bhutanese movies, Maldives movies, Afghan movies, Iranian movies, Iraqi movies, Syrian movies, Lebanese movies, Jordanian movies, Palestinian movies, Israeli movies, Egyptian movies, Moroccan movies, Algerian movies, Tunisian movies, Libyan movies, Sudanese movies, Ethiopian movies, Kenyan movies, Nigerian movies, Ghanaian movies, South African movies, Zimbabwean movies, Zambian movies, Malawian movies, Mozambican movies, Angolan movies, Namibian movies, Botswana movies, Lesotho movies, Swaziland movies, Madagascar movies, Mauritius movies, Seychelles movies, Comoros movies, Mayotte movies, Reunion movies, Djibouti movies, Eritrea movies, Somalia movies, Somaliland movies, Uganda movies, Tanzania movies, Rwanda movies, Burundi movies, Democratic Republic of Congo movies, Republic of Congo movies, Central African Republic movies, Chad movies, Cameroon movies, Gabon movies, Equatorial Guinea movies, Sao Tome and Principe movies, Cape Verde movies, Guinea-Bissau movies, Guinea movies, Sierra Leone movies, Liberia movies, Ivory Coast movies, Burkina Faso movies, Mali movies, Niger movies, Senegal movies, Gambia movies, Mauritania movies, Western Sahara movies, download Morocco movies, download Algeria movies, download Tunisia movies, download Libya movies, download Egypt movies, download Sudan movies, download South Sudan movies, download Ethiopia movies, download Eritrea movies, download Djibouti movies, download Somalia movies, download Somaliland movies, download Kenya movies, download Uganda movies, download Tanzania movies, download Rwanda movies, download Burundi movies, download Democratic Republic of Congo movies, download Republic of Congo movies, download Central African Republic movies, download Chad movies, download Cameroon movies, download Gabon movies, download Equatorial Guinea movies, download Sao Tome and Principe movies, download Cape Verde movies, download Guinea-Bissau movies, download Guinea movies, download Sierra Leone movies, download Liberia movies, download Ivory Coast movies, download Burkina Faso movies, download Mali movies, download Niger movies, download Senegal movies, download Gambia movies, download Mauritania movies, download Western Sahara movies. Free HD movie downloads, 1080p movies download, 720p movies download, 480p movies download, movie download sites, download movies online, free HD movies, download movies HD quality, watch movies online free, stream movies free, download latest movies, new movies download.',
     url: 'https://watchmoviehub.live',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://watchmoviehub.live/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://www.facebook.com/watchmoviehub',
      'https://twitter.com/watchmoviehub',
      'https://www.instagram.com/watchmoviehub',
      'https://www.youtube.com/@watchmoviehub',
      'https://www.tiktok.com/@watchmoviehub'
    ],
         publisher: {
       '@type': 'Organization',
       name: 'Movie Downloads & Streaming',
       logo: {
         '@type': 'ImageObject',
         url: 'https://watchmoviehub.live/logo.png'
       },
       sameAs: [
         'https://www.facebook.com/watchmoviehub',
         'https://twitter.com/watchmoviehub',
         'https://www.instagram.com/watchmoviehub'
       ]
     }
  };

  return (
    <PageWrapper>
      <Head>
        {/* Primary Meta Tags */}
        <title>{selectedTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
                 <meta name="author" content="Movie Downloads & Streaming" />
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
        <meta property="twitter:site" content="@watchmoviehub" />
        <meta property="twitter:creator" content="@watchmoviehub" />

        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
                 <meta name="application-name" content="Movie Downloads & Streaming" />
        <meta name="apple-mobile-web-app-title" content="Movie Downloads" />
        
                 {/* Social Media Meta Tags for Trust */}
         <meta property="og:site_name" content="Movie Downloads & Streaming" />
         <meta property="og:locale" content="en_US" />
        <meta name="twitter:site" content="@watchmoviehub" />
        <meta name="twitter:creator" content="@watchmoviehub" />
        
        {/* Social Media Links for Trust */}
        <link rel="me" href="https://www.facebook.com/watchmoviehub" />
        <link rel="me" href="https://twitter.com/watchmoviehub" />
        <link rel="me" href="https://www.instagram.com/watchmoviehub" />
        <link rel="me" href="https://www.youtube.com/@watchmoviehub" />
        <link rel="me" href="https://www.tiktok.com/@watchmoviehub" />

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

// Generate static paths for SEO-optimized movies only
export async function getStaticPaths() {
  try {
    // Focus on movies that actually rank well in search
    const seoMovies = [];
    
    // 1. Popular movies (high search volume)
    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
      );
      const data = await response.json();
      seoMovies.push(...(data.results || []));
    }

    // 2. Upcoming movies (trending searches)
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`
      );
      const data = await response.json();
      seoMovies.push(...(data.results || []));
    }

    // 3. Now playing (current interest)
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`
      );
      const data = await response.json();
      seoMovies.push(...(data.results || []));
    }

    // 4. Top rated (evergreen content)
    for (let page = 1; page <= 5; page++) {
      const response = await fetch(
        `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`
      );
      const data = await response.json();
      seoMovies.push(...(data.results || []));
    }

    // Remove duplicates and prioritize by popularity
    const uniqueMovies = seoMovies.filter(
      (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
    );
    
    // Sort by popularity (vote_average * vote_count)
    const sortedMovies = uniqueMovies.sort((a, b) => {
      const scoreA = (a.vote_average || 0) * (a.vote_count || 0);
      const scoreB = (b.vote_average || 0) * (b.vote_count || 0);
      return scoreB - scoreA;
    });
    
    // Take top 500 movies for pre-generation (Vercel-friendly)
    const paths = sortedMovies.slice(0, 500).map((movie) => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '2024';
      const slug = createMovieSlug(movie.title, year, movie.id);
      return {
        params: { slug },
      };
    });

    console.log(`Pre-generating ${paths.length} SEO-optimized movie pages`);

    return {
      paths,
      fallback: 'blocking', // Generate remaining pages on-demand
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
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
      return {
        notFound: true,
      };
    }

    // Fetch movie data
    const movieResponse = await fetch(
      `${TMDB_API_BASE_URL}/${TMDB_API_VERSION}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,images`
    );

    if (!movieResponse.ok) {
      return {
        notFound: true,
      };
    }

    const movie = await movieResponse.json();

    // Verify the slug matches the movie
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '2024';
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
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
}

export default MoviePage;
