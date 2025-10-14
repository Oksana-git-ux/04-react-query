import axios from 'axios';
import { type Movie } from '../types/movie'; 

interface MovieApiResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

interface FetchMoviesResult {
    movies: Movie[];
    totalPages: number;
}

interface FetchMoviesParams {
  query: string;
  page: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMovies({ query, page }: FetchMoviesParams): Promise<FetchMoviesResult> {
  if (!TMDB_TOKEN) {
    throw new Error("TMDB Token is not defined in environment variables.");
  }
  
  if (!query) {
      return { movies: [], totalPages: 0 };
  }

  const config = {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  const response = await axios.get<MovieApiResponse>(
    `${BASE_URL}/search/movie`,
    config
  );

  return {
      movies: response.data.results,
      totalPages: response.data.total_pages,
  };
}

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
    if (!path) {
        return 'https://via.placeholder.com/500x750?text=No+Image'; 
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
};