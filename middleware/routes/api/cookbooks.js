const express = require("express");
const uuid = require("uuid");
const cookbooks = require("../../cookbooks");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(cookbooks);
});

router.get("/:id", (req, res) => {
  const found = cookbooks.some(item => item.id === req.params.id);

  if (found) {
    res.json(cookbooks.filter(item => item.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No cookbook with id ${req.params.id}` });
  }
});

module.exports = router;
