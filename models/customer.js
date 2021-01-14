const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    isGold: { type: Boolean, default: false },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 10,
    },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean().required(),
    name: Joi.string().required().min(5).max(50),
    phone: Joi.string().required().min(5).max(50),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
