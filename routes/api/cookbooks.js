const express = require("express");
const uuid = require("uuid");
const cookbooks = require("../../cookbooks");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(cookbooks);
});

router.get("/:id", (req, res) => {
  const found = cookbooks.some(item => item.id === parseInt(req.params.id));

  if (found) {
    res.json(cookbooks.filter(item => item.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No cookbook with id ${req.params.id}` });
  }
});

router.post("/", (req, res) => {
  const newCookbook = {
    id: uuid.v4(),
    name: req.body.name,
    price: req.body.price
  };

  if (!newCookbook.name || !newCookbook.price) {
    return res.status(400).json({ msg: "Please provide a name and a price." });
  }

  cookbooks.push(newCookbook);
  res.status(201).json(newCookbook);
});

router.put("/:id", (req, res) => {
  const found = cookbooks.some(item => item.id === parseInt(req.params.id));

  if (found) {
    const updCookbook = req.body;

    cookbooks.forEach(cookbook => {
      if (cookbook.id === parseInt(req.params.id)) {
        cookbook.name = updCookbook.name ? updCookbook.name : cookbook.name;
        cookbook.price = updCookbook.price ? updCookbook.price : cookbook.price;

        return res.status(201).json(cookbook);
      }
    });
  } else {
    res.status(400).json({ msg: `No cookbook with id ${req.params.id}` });
  }
});

router.delete("/:id", (req, res) => {
  const found = cookbooks.some(item => item.id === parseInt(req.params.id));

  if (found) {
    cookbooks.forEach((cookbook, index) => {
      if (cookbook.id === parseInt(req.params.id)) {
        cookbooks.splice(index, index + 1);
        return res.status(200).json(cookbooks);
      }
    });
  } else {
    res.status(400).json({ msg: `No cookbook with id ${req.params.id}` });
  }
});

module.exports = router;
