const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const config = require("config");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { requireAuth , checkUser  , isAdmin} = require("./middleware/authMiddleware");

const configDb = config.get("database");
// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = `mongodb+srv://${configDb.username}:${configDb.password}@cluster0.qe3tq.mongodb.net/${configDb.database}`;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.get("/adminPage", requireAuth, isAdmin ,  (req, res) => res.render("adminPage"));
app.use(authRoutes);

module.exports = app;
