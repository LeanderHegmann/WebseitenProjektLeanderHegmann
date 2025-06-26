console.log("Starte Server");


const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("Dadentank.db");

// Tabelle erstellen, falls sie nicht existiert
db.run(`
  CREATE TABLE IF NOT EXISTS zitate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autor TEXT NOT NULL,
    zitat TEXT NOT NULL
  )
`);

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Logging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

// Zitat hinzufügen
app.post("/zitate", (req, res) => {
  const { autor, zitat } = req.body;
  if (!autor || !zitat) {
    return res.status(400).json({ error: "Autor und Zitat erforderlich" });
  }
  db.run("INSERT INTO zitate (autor, zitat) VALUES (?, ?)", [autor, zitat], function (err) {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Speichern in die Datenbank" });
    }
    res.status(201).json({ id: this.lastID, autor, zitat });
  });
});

// Alle Zitate liefern
app.get("/zitate", (req, res) => {
  db.all("SELECT * FROM zitate", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Abrufen der Zitate" });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://127.0.0.1:${port}`);
});
