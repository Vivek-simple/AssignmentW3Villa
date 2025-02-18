require("dotenv").config();
const express = require("express");
const User = require("./model/user");
const Task = require("./model/task");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mid = require("./middileware/mid");

const cookieParser = require("cookie-parser");
const app = express();

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.error = req.error;
  next();
});

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/signup", (req, res) => {
  res.render("Signup.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.render("home.ejs");
});

app.get("/viewTask", mid, async (req, res) => {
  try {
    const tasks = await Task.find({ createBy: req.user._id });
    res.render("task.ejs", { tasks });
  } catch (error) {
    res.status(500).json({ error: `error to fetch tasks ${error}` });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    if (!name || !email || !password || !city) {
      res.locals.error = "please add all the fields";
      return res.render("Signup.ejs");
    } else {
      const user = await User.findOne({ email: email });

      if (user) {
        res.locals.error = "User already registered";
        return res.render("Signup.ejs");
      } else {
        const newPassword = await bcrypt.hash(password, 10);
        let newUser = new User({
          name: name,
          email: email,
          password: newPassword,
          city: city,
        });
        const saveUser = await newUser.save();
        res.redirect("/login");
      }
    }
  } catch (error) {
    console.error(error);
    res.locals.error = "Error in signup";
    return res.render("signup");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.locals.error = "Fill  all the fields";
    return res.render("login");
  } else {
    try {
      const saveUser = await User.findOne({ email: email });

      if (!saveUser) {
        res.locals.error = "User does not exist";
        return res.render("login");
      }
      const isPasswordMatch = await bcrypt.compare(password, saveUser.password);

      if (isPasswordMatch) {
        const token = await jwt.sign(
          { _id: saveUser._id },
          process.env.JWT_SECRET
        );
        res.cookie("jwt", token, { httpOnly: true });
        return res.redirect("/viewTask");
      } else {
        res.locals.error = "invalid password";
        return res.render("login");
      }
    } catch (error) {
      console.error(error);
      res.locals.error = "Error in login";
      return res.render("login");
    }
  }
});

app.post("/addTask", mid, async (req, res) => {
  const { task } = req.body;
  if (!task) {
    res.locals.error = "please add the task";
    return res.redirect("viewTask");
  }
  try {
    const saveTask = new Task({
      task: task,
      createBy: req.user,
    });
    const newTask = await saveTask.save();
    res.redirect("/viewTask");
  } catch (error) {
    console.error(error);
    res.locals.error = "Error in adding task";
    return res.redirect("/viewTask");
  }
});

app.get("/deleteTask/:id", mid, async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findById(id);

    if (!task || task.createBy.toString() !== req.user._id.toString()) {
      res.locals.error = "Unauthorized user";
      return res.redirect("viewTask");
    }
    await Task.findByIdAndDelete(req.params.id);

    res.redirect("/viewTask");
  } catch (error) {
    console.error(error);
    res.locals.error = "Error in delete task";
    res.redirect("/viewTask");
  }
});

app.post("/editTask/:id", mid, async (req, res) => {
  const id = req.params.id;
  const { task } = req.body;
  try {
    const userTask = await Task.findById(id);
    if (!task || userTask.createBy.toString() !== req.user._id.toString()) {
      res.locals.error = "unauthorized user";
      return res.redirect("viewTask");
    }

    if (!task) {
      res.locals.error = "Task cannot be empty";
      return res.render("task.ejs");
    }
    await Task.findByIdAndUpdate(req.params.id, { task });
    res.redirect("/viewTask");
  } catch (error) {
    console.error(error);
    res.locals.error = "Error in edit  task";
    res.redirect("/viewTask");
  }
});

app.get("*", (req, res) => {
  res.locals.error = "404 page not found";
  res.render("pageNotFound.ejs");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then((res) => console.log("Db connected"))
  .catch((err) => console.log("error", err));

app.listen(port, () => {
  console.log(`server is running port http://localhost:${port}`);
});
