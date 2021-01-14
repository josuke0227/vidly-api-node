const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Customer");

  const customer = await Customer.find({
    _id: id,
  });

  if (!customer.length)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isGold, name, phone } = req.body;
  const customer = new Customer({
    isGold,
    name,
    phone,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Customer");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { isGold, name, phone } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    id,
    {
      isGold,
      name,
      phone,
    },
    {
      new: true,
    }
  );

  if (!customer)
    return res.status(404).send("The customer with the given ID was not found");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send("Invalid Customer");

  const customer = await Customer.findByIdAndDelete(id);

  if (!customer)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(customer);
});

module.exports = router;
