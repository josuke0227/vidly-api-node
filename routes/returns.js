const Joi = require("joi");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!req.body.customerId)
    return res.status(400).send("customerId is not provided");

  if (!req.body.movieId) return res.status(400).send("movieId is not provided");

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("The movie is already returned.");

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  rental.return();
  await rental.save();

  return res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId(),
    movieId: Joi.objectId(),
  });

  return schema.validate(req);
}

module.exports = router;
