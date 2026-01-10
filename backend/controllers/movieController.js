import Movie from "../models/movieModel.js";
import { movieQueue } from "../queue/movieQueue.js";
// Get all movies
// export const getMovies = async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     res.json(movies);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments();

    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add movie (admin)
// export const addMovie = async (req, res) => {
//   try {
//     const movie = await Movie.create(req.body);
//     res.status(201).json(movie);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete movie
export const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSortedMovies = async (req, res) => {
  const { sortBy } = req.query;

  const allowedFields = ["title", "rating", "releaseDate", "duration"];
  if (!allowedFields.includes(sortBy)) {
    return res.status(400).json({ message: "Invalid sort field" });
  }
  const sortOrder = (sortBy === 'rating' || sortBy === 'releaseDate') ? -1 : 1;

  const movies = await Movie.find().sort({ [sortBy]: sortOrder });
  res.json(movies);
};


export const searchMovies = async (req, res) => {
  const { q } = req.query;

  const movies = await Movie.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ]
  });

  res.json(movies);
};

// Direct add (for testing/backup)
export const addMovieDirect = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      message: "Movie added successfully",
      movie
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMovie = async (req, res) => {
  try {
    await movieQueue.add("add-movie", req.body);

    res.status(202).json({
      message: "Movie added to queue. It will be processed shortly.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};