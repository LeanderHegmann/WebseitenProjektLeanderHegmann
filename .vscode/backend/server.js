console.log("Starte Server");

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const express = require("express");
const cors = require("cors");

const db = new sqlite3.Database("/workspaces/WebseitenProjektLeanderHegmann/.vscode/backend/Dadentank.db");

// Tabelle erstellen, falls sie nicht existiert
db.run(`
  CREATE TABLE IF NOT EXISTS zitate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    autor TEXT NOT NULL,
    zitat TEXT NOT NULL
  )
`);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Frontend bereitstellen
app.use(express.static(path.join(__dirname, "..", "frontend")));

// 🔹 Zitat hinzufügen
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

// 🔹 Alle Zitate abrufen
app.get("/zitate", (req, res) => {
  db.all("SELECT * FROM zitate", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Abrufen der Zitate" });
    }
    res.json(rows);
  });
});

// 🔹 Einzelnes Zitat löschen
app.delete("/zitate/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM zitate WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Fehler beim Löschen des Zitats" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Zitat nicht gefunden" });
    }
    return res.status(200).json({ message: "Zitat gelöscht", id });
  });
});

// 🔹 Zufälliges Zitat eines bestimmten Autors liefern
app.get("/zitate/random", (req, res) => {
  const autor = req.query.autor;
  if (!autor) {
    return res.status(400).json({ error: "Autor fehlt" });
  }

  db.all("SELECT * FROM zitate WHERE autor = ?", [autor], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ error: "Keine Zitate gefunden" });
    }

    const zufall = rows[Math.floor(Math.random() * rows.length)];
    res.json(zufall);
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://127.0.0.1:${port}`);
});
