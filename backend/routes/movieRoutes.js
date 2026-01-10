import express from "express";
import {
  getMovies,
  addMovie,
  addMovieDirect, // Add this
  updateMovie,
  getSortedMovies,
  deleteMovie,
  searchMovies,
} from "../controllers/movieController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js"

const router = express.Router();

router.get("/", getMovies);
router.get("/sorted", getSortedMovies);
router.get("/search", searchMovies);
router.post("/", authMiddleware, adminMiddleware, addMovie); // Queue version
router.post("/direct", authMiddleware, adminMiddleware, addMovieDirect); // Direct version
router.put("/:id", authMiddleware, adminMiddleware, updateMovie);
router.delete("/:id", authMiddleware, adminMiddleware, deleteMovie);

export default router;