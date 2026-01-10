import fetch from 'node-fetch';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/movieModel.js';

dotenv.config();

const OMDB_API_KEY = '2cceb59f'; // Replace with your key

// IMDb Top 250 IDs (sample of 50 - you can add more)
const imdbIds = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0071562', // The Godfather Part II
  'tt0468569', // The Dark Knight
  'tt0050083', // 12 Angry Men
  'tt0108052', // Schindler's List
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt0110912', // Pulp Fiction
  'tt0060196', // The Good, the Bad and the Ugly
  'tt0137523', // Fight Club
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0109830', // Forrest Gump
  'tt0080684', // Star Wars: Episode V
  'tt1375666', // Inception
  'tt0167261', // The Lord of the Rings: The Two Towers
  'tt0073486', // One Flew Over the Cuckoo\'s Nest
  'tt0099685', // Goodfellas
  'tt0133093', // The Matrix
  'tt0047478', // Seven Samurai
  'tt0114369', // Se7en
  'tt0317248', // City of God
  'tt0076759', // Star Wars
  'tt0102926', // The Silence of the Lambs
  'tt0038650', // It\'s a Wonderful Life
  'tt0118799', // Life Is Beautiful
  'tt0114814', // The Usual Suspects
  'tt0245429', // Spirited Away
  'tt0120815', // Saving Private Ryan
  'tt0120689', // The Green Mile
  'tt0816692', // Interstellar
  'tt0054215', // Psycho
  'tt0021749', // City Lights
  'tt0064116', // Once Upon a Time in the West
  'tt0034583', // Casablanca
  'tt0027977', // Modern Times
  'tt0047396', // Rear Window
  'tt0082971', // Raiders of the Lost Ark
  'tt0407887', // The Departed
  'tt0172495', // Gladiator
  'tt0114709', // Toy Story
  'tt0110413', // Léon: The Professional
  'tt0482571', // The Prestige
  'tt0095327', // Grave of the Fireflies
  'tt0253474', // The Pianist
  'tt0095765', // Cinema Paradiso
  'tt0078788', // Apocalypse Now
  'tt0103064', // Terminator 2
  'tt0088763', // Back to the Future
  'tt0078748', // Alien
  'tt0209144', // Memento
];

async function fetchMovieData(imdbId) {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`
    );
    const data = await response.json();

    if (data.Response === 'False') {
      console.log(` Movie not found: ${imdbId}`);
      return null;
    }

    return {
      title: data.Title,
      description: data.Plot !== 'N/A' ? data.Plot : 'No description available',
      rating: data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : 0,
      duration: data.Runtime !== 'N/A' ? parseInt(data.Runtime) : 0,
      releaseDate: data.Released !== 'N/A' ? new Date(data.Released) : null,
    };
  } catch (error) {
    console.error(`Error fetching ${imdbId}:`, error.message);
    return null;
  }
}

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB');

    // Clear existing movies (optional - comment out if you want to keep existing)
    // await Movie.deleteMany({});
    // console.log('🗑️  Cleared existing movies');

    let successCount = 0;
    let errorCount = 0;

    // Fetch and save movies
    for (let i = 0; i < imdbIds.length; i++) {
      const imdbId = imdbIds[i];
      console.log(`\n📥 Fetching ${i + 1}/${imdbIds.length}: ${imdbId}`);

      const movieData = await fetchMovieData(imdbId);

      if (movieData) {
        // Check if movie already exists
        const existingMovie = await Movie.findOne({ title: movieData.title });
        
        if (existingMovie) {
          console.log(`  Already exists: ${movieData.title}`);
        } else {
          await Movie.create(movieData);
          console.log(` Added: ${movieData.title} (${movieData.rating}/10)`);
          successCount++;
        }
      } else {
        errorCount++;
      }

      // Delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log('\n' + '='.repeat(50));
    console.log(` Successfully added: ${successCount} movies`);
    console.log(` Errors: ${errorCount}`);
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  }
}

populateDatabase();