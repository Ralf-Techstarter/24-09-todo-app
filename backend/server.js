const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

//TODO: Verbinde eine Datenbank dazu

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

app.use(cors());                // Middleware
app.use(bodyParser.json());     // Middleware (wie ein Übersetzer)

//TODO: Schreibe requests/responses


// Liste mir alle existierende Items
// hier sollte nur alle Items als JSON im Response geschrieben werden
app.get('/liste_abrufen', async (req, res) => {
    const result = await pool.query('SELECT * FROM tasks')
    res.json(result.rows)
});


app.post('/add', async (req, res) => {
    console.log("POST kommt an");
    try {
      const result = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [req.body.title]);
      res.json(result.rows);
    } catch (error) {
      console.error("Fehler beim Einfügen der Aufgabe:", error);
      res.status(500).json({ error: "Fehler beim Einfügen der Aufgabe" });
    }
  });


  app.delete('/delete/:id', async (req, res) => {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rowCount > 0) {
      res.json({ message: "Aufgabe gelöscht", task: result.rows[0] });
    } else {
      res.status(404).json({ error: "Aufgabe nicht gefunden" });
    }
  });


  app.put('/update/:id', async (req, res) => {
    const { completed } = req.body;
    const result = await pool.query('UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *', [completed, req.params.id]);
    if (result.rowCount > 0) {
      res.json({ message: "Aufgabe aktualisiert", task: result.rows[0] });
    } else {
      res.status(404).json({ error: "Aufgabe nicht gefunden" });
    }
  });


app.listen(3050, "localhost", () => {
    console.log("bald wird es Mittagspause")
});