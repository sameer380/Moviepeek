import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { extractMovieIdFromSlug } from 'utils/helpers/movieSlugs';

const StreamPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      const movieId = extractMovieIdFromSlug(slug);
      if (movieId) {
        // Redirect to the main movie page
        router.replace(`/movie/${slug}`);
      } else {
        router.push('/404');
      }
    }
  }, [slug, router]);

  return null;
};

export default StreamPage;
