const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  createBy: {
    type: ObjectId,
    ref: "User",
  },
});

const task = mongoose.model("Task", taskSchema);
module.exports = task;
