const bcrypt = require("bcrypt");
const userRourter = require("express").Router();
const User = require("../models/user");

userRourter.get("/", async (requrest, response) => {
  const users = await User.find({});
  response.json(users.map(u => u.toJSON()));
});

userRourter.post("/", async (request, response, next) => {
  const body = request.body;

  if (body.password === undefined) {
    return response.status(400).json({ error: "no password" });
  }
  if (body.password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  });

  try {
    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = userRourter;
