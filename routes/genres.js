const Joi = require("joi");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.find({
    _id: req.params.id,
  });

  if (!genre.length)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(genre);
});

router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  res.send(genre);
});

router.put("/:id", [auth, validate(validateGenre)], async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Genre");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
    },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Genre");

  const genre = await Genre.findByIdAndDelete(id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
  });

  return schema.validate(genre);
}

module.exports = router;
