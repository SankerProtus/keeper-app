import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const db = new pg.Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT || 5432
})

db.connect();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Get and display all notes from the DB
app.get('/api/get-notes', async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM notes ORDER BY id DESC");
    const data = response.rows;
    res.json(data);
  } catch (error) {
    console.log('Error executimg query: ', error);
    res.status(500).send("Database error");
  }
});

// Add new notes
app.post('/api/add/note', async (req, res) => {
    const title = (req.body && req.body.title) ? String(req.body.title).trim() : null;
    const content = (req.body && req.body.content) ? String(req.body.content).trim() : null;

    if (!title && !content) return res.status(400).send("Note is empty");

    try {
        const response = await db.query("INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *", [title, content]);
        res.json(response.rows[0]);
    } catch (error) {
        console.log("Error executing query: ", error);
        res.status(500).send("Database error");
    }

});

// Edit an existing note
app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Ensure note exists
    const existing = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    const updateRes = await db.query(
      "UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content) WHERE id = $3 RETURNING *",
      [title, content, id]
    );

    res.json(updateRes.rows[0]);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Database error" });
  }
});


// Delete a note
app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
     await db.query("DELETE FROM notes WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).send("Database error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});