import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast'; 

import { fetchMovies } from '../../services/movieService';
import { type Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import css from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    initialData: { movies: [], totalPages: 0 },
  });

  useEffect(() => {
        if (isError) {
            toast.error('Error loading movies. Please check your network or API token.');
        }
    }, [isError]);

  const movies = data?.movies || [];
  const totalPages = data?.totalPages || 0;
  

  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(1);
    }
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };
  
  const handleMovieSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleModalClose = () => setSelectedMovie(null);

  const shouldRenderPagination = totalPages > 1;
  const shouldRenderGrid = movies.length > 0 && !isLoading && !isError;
  const showNoResultsMessage = useMemo(() => {
    return !!query && isSuccess && movies.length === 0;
  }, [query, isSuccess, movies.length]);

  useEffect(() => {
    if (showNoResultsMessage) {
      toast.error(`No movies found for your request: "${query}"`);
    }
  }, [showNoResultsMessage, query]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearchSubmit} />
      
      <main>
        {(isLoading || isFetching) && <Loader />}
        {isError && <ErrorMessage />}
        
        {shouldRenderGrid && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        )}

        {shouldRenderPagination && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
      
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;