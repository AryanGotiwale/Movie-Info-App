const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {  // ← Add 'export' here!
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  register: async (name, email, password, role = 'user') => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    return res.json();
  },

  addMovieDirect: async (movieData, token) => {
  const res = await fetch(`${API_URL}/movies/direct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(movieData),
  });
  return res.json();
},  

  // Movies
  getMovies: async (page = 1, limit = 9) => {
    const res = await fetch(`${API_URL}/movies?page=${page}&limit=${limit}`);
    return res.json();
  },

  searchMovies: async (query) => {
    const res = await fetch(`${API_URL}/movies/search?q=${query}`);
    return res.json();
  },

  getSortedMovies: async (sortBy) => {
    const res = await fetch(`${API_URL}/movies/sorted?sortBy=${sortBy}`);
    return res.json();
  },

  addMovie: async (movieData, token) => {
    const res = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movieData),
    });
    return res.json();
  },

  updateMovie: async (id, movieData, token) => {
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movieData),
    });
    return res.json();
  },

  deleteMovie: async (id, token) => {
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};