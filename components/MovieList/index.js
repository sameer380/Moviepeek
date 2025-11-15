import MoviesGridContainer from './MoviesGridContainer';
import MovieListItem from './MovieListItem';
import Pagination from 'components/Pagination';
import withTheme from 'utils/hocs/withTheme';

const MovieList = ({ theme, movies, baseUrl }) => {
  // Defensive rendering: during prerender or if an API request fails,
  // `movies` or `movies.results` may be undefined. Avoid throwing.
  if (!movies || !Array.isArray(movies.results) || movies.results.length === 0) {
    return null;
  }

  return (
    <>
      <MoviesGridContainer theme={theme}>
        {movies.results.map((movie, index) => (
          <MovieListItem
            theme={theme}
            key={movie.id}
            movie={movie}
            fetchpriority={index === 0 ? 'high' : 'low'}
            baseUrl={baseUrl}
          />
        ))}
      </MoviesGridContainer>
      <Pagination page={movies.page} totalPages={movies.total_pages} />
    </>
  );
};

export default withTheme(MovieList);
