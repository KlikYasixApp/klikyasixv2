const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

app.use(
  "/stylesheet",
  express.static(path.join(__dirname, "views", "stylesheet")),
);
app.use(
  "/scripts",
  express.static(path.join(__dirname, "views", "scripts")),
);
app.use("/media", express.static(path.join(__dirname, "source", "media")));

app.use(express.static(path.join(viewsDir)));

const pagesDir = path.join(viewsDir, "pages");

if (fs.existsSync(pagesDir)) {
  const items = fs.readdirSync(pagesDir, { withFileTypes: true });

  items.forEach((item) => {
    if (item.isDirectory()) {
      const folderName = item.name; // e.g., "Carts"
      const routeName = folderName.toLowerCase(); // e.g., "carts"
      const indexFile = path.join(pagesDir, folderName, "index.ejs");

      if (fs.existsSync(indexFile)) {
        if (routeName === "home") {
          app.get("/", (req, res) => {
            res.render("pages/Home/index");
          });
        }

        app.get(`/${routeName}`, (req, res) => {
          res.render(`pages/${folderName}/index`);
        });

        console.log(
          `[Routing] Registered: /${routeName} -> pages/${folderName}/index.ejs`,
        );
      }
    }
  });
} else {
  console.error(`[Routing Error] Directory not found: ${pagesDir}`);
}

app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
