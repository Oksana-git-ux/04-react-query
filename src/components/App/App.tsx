import { useState } from 'react';
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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearchSubmit = async (query: string) => {
    setMovies([]); 
    setError(null);
    setCurrentQuery(query);
    setIsLoading(true);

    try {
      const results = await fetchMovies({ query });
      
      if (results.length === 0) {
        toast.error(`No movies found for your request: "${query}"`);
      }
      
      setMovies(results);
    } catch (err) {
      setError('Failed to load movies. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMovieSelect = (movie: Movie) => {
      setSelectedMovie(movie);
  };
  
  const handleModalClose = () => {
      setSelectedMovie(null);
  };

  const shouldRenderGrid = movies.length > 0 && !isLoading && !error;
  
  return (
    <div className={css.app}>
      {currentQuery && <h2>Results for: {currentQuery}</h2>}
      <SearchBar onSubmit={handleSearchSubmit} />
      
      <main>
        {isLoading && <Loader />}
        {error && <ErrorMessage />}
        
        {shouldRenderGrid && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
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