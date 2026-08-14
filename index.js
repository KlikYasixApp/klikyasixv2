const express = require("express");
const path = require("path");
const fs = require("fs");
const { connection } = require("./src/database/db_connection");
require("dotenv").config();

const app = express();

const WEB_TITLE = process.env.WEB_TITLE;

app.set("view engine", "ejs");

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

app.use(
  "/stylesheet",
  express.static(path.join(__dirname, "views", "stylesheet")),
);
app.use("/scripts", express.static(path.join(__dirname, "views", "scripts")));
app.use("/media", express.static(path.join(__dirname, "source", "media")));

app.use(express.static(path.join(viewsDir)));

const pagesDir = path.join(viewsDir, "pages");

// SQL

const getData = (table) => {
  connection.query(`SELECT * FROM ${table}`, (error, results) => {
    if (error) throw error;
    console.log("User Data:", results);
  });
};

app.get("/", (req, res) => {
  res.render("pages/Home/index", {
    title: WEB_TITLE,
  });
});

app.get("/carts", (req, res) => {
  res.render("pages/Carts/index");
});

app.get("/orders", (req, res) => {
  res.render("pages/Orders/index");
});

app.get("/products", (req, res) => {
  res.render("pages/Products/index");
});

app.get("/login", (req, res) => {
  res.render("pages/Login/index");
});

app.get("/checkout", (req, res) => {
  res.render("pages/Checkout/index");
});

app.get("/admin", (req, res) => {
  res.render("pages/Admin/index");
});

app.get("/admin/sellers", (req, res) => {
  res.render("pages/Admin/Sellermanage/index");
});

app.get("/admin/sellers/:id/edit", (req, res) => {
  res.render("pages/Admin/Sellermanage/Edit/index");
});

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

const PORT = process.env.WEB_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
