const express = require("express");

const { Customer, validate } = require("../models/customer.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.updateOne(
      { _id: req.params.id },
      { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },

      { new: true }
    );

    res.send(customer);
  } catch (err) {
    return res.status(404).send("The customer with given ID not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.deleteOne({ _id: req.params.id });
    res.send(customer);
  } catch (err) {
    return res.status(404).send(`The customer with given ID not found ${err}`);
  }
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("The customer with given ID not found");
  res.send(customer);
});

module.exports = router;
