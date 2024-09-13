'use client'; // Ensure this component runs as a Client Component in Next.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Recommend() {
  const [movie, setMovie] = useState(''); // Selected movie
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');
  const [allMovies, setAllMovies] = useState([]); // List of all movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Movies filtered based on user input

  // Fetch the list of all movies when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/movies'); // Assuming your Flask app has a route to fetch all movies
        setAllMovies(response.data);
      } catch (error) {
        console.log('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  // Filter the movie list based on user input
  useEffect(() => {
    if (movie) {
      const filtered = allMovies.filter(m =>
        m.toLowerCase().includes(movie.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies([]);
    }
  }, [movie, allMovies]);

  // Handle movie recommendation
  const handleRecommend = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/recommend', { movie });
      setRecommendations(response.data);
      setError('');
    } catch (err) {
      setError('Movie not found. Please try another title.');
      setRecommendations([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 via-indigo-800 to-purple-900">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">Movie Recommender</h1>
        <p className="text-xl text-gray-200 mt-3">Discover movies similar to your favorites!</p>
      </div>

      <div className="relative mb-6 w-96">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
          className="p-3 w-full rounded-md border-2 border-gray-300 bg-white bg-opacity-80 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Dropdown for displaying filtered movies */}
        {filteredMovies.length > 0 && (
          <ul className="absolute left-0 top-full z-10 w-full bg-white bg-opacity-90 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
            {filteredMovies.map((m, index) => (
              <li
                key={index}
                onClick={() => {
                  setMovie(m);
                  setFilteredMovies([]);
                }}
                className="p-2 hover:bg-indigo-600 hover:text-white cursor-pointer transition-colors duration-200"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleRecommend}
        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-lg transition-all duration-300 ease-in-out"
      >
        Get Recommendations
      </button>

      {error && <p className="text-red-400 text-lg mt-4">{error}</p>}

      <div className="w-full max-w-3xl bg-white bg-opacity-60 p-6 rounded-lg shadow-xl mt-8">
        {recommendations.length > 0 && (
          <>
            <h2 className="text-3xl text-gray-800 font-semibold mb-4">Recommended Movies:</h2>
            <ul className="list-disc list-inside text-gray-700">
              {recommendations.map((rec, index) => (
                <li key={index} className="mb-2 text-lg">{rec}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
