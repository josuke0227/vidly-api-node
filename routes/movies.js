const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Movie } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Movie");

  const movie = await Movie.find({
    _id: id,
  });

  if (!movie.length)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(movie);
});

router.post("/", [auth, validate(validateMovie)], async (req, res) => {
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", [auth, validate(validateMovie)], async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Movie");

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      genre: {
        id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with given ID was not fund.");

  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Movie");

  const movie = await Movie.findByIdAndRemove(id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().required().min(5).max(50),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required().min(0),
    dailyRentalRate: Joi.number().required().min(0),
  });

  return schema.validate(movie);
}

module.exports = router;
