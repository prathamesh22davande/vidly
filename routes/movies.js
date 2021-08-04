const express = require("express");
const { Genre } = require("../models/genre");

const { Movie, validate } = require("../models/movie");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) return res.status(400).send("Invalid Genre");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  try {
    const movie = await Movie.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
      { new: true }
    );
    res.send(movie);
  } catch (err) {
    return res.status(404).send("The movie with given ID not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.deleteOne({ _id: req.params.id });
    res.send(movie);
  } catch (err) {
    return res.status(404).send("The movie with given ID not found");
  }
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("The movie with given ID not found");
  res.send(movie);
});

module.exports = router;
