const { Router } = require("express");

const userRoutes = Router();

userRoutes.post("/", (req, res) => {
  const { name, email } = req.body;
  res.json({ name, email });
});

module.exports = userRoutes;
