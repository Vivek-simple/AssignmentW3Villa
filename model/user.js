const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    require: true,
  },

  city: {
    type: String,
    require: true,
  },
});

const user = mongoose.model("User", userSchema);
module.exports = user;
