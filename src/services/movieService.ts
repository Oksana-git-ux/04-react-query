import axios, { type AxiosRequestConfig } from 'axios';
import { type Movie } from '../types/movie';

export interface MovieApiResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface FetchMoviesParams {
  query: string;
  page?: number;
}

export async function fetchMovies({ query, page = 1 }: FetchMoviesParams): Promise<Movie[]> {
  if (!TMDB_TOKEN) {
    throw new Error("TMDB Token is not defined in environment variables.");
  }

  const config: AxiosRequestConfig = {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const response = await axios.get<MovieApiResponse>(
      `${BASE_URL}/search/movie`,
      config
    );
    
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movies from API.");
  }
}

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500'): string => {
    if (!path) {
        return 'https://via.placeholder.com/500x750?text=No+Image'; 
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
};