const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "secret_key_demo",
    resave: false,
    saveUninitialized: false,
  })
);

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// fake database (tạm thời)
const users = [];

// routes
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash, balance: 0 });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.send("Sai tài khoản");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.send("Sai mật khẩu");

  req.session.user = user;
  res.redirect("/wallet");
});

app.get("/wallet", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("wallet", { user: req.session.user });
});

// start server
const PORT = 3000;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

