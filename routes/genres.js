const express = require("express");

const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.updateOne(
      { _id: req.params.id },
      { name: req.body.name },
      { new: true }
    );
    res.send(genre);
  } catch (err) {
    return res.status(404).send("The genre with given ID not found");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const genre = await Genre.deleteOne({ _id: req.params.id });
    res.send(genre);
  } catch (err) {
    return res.status(404).send("The genre with given ID not found");
  }
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("The genre with given ID not found");
  res.send(genre);
});

module.exports = router;
