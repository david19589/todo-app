import pkg from "pg";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";

const { Pool } = pkg;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todoList",
  password: "adminpas",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("connected");
  }
});

app.get("/todo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM list");
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving list:", err);
    res.status(500).send("Error retrieving list");
  }
});

app.post("/todo", async (req, res) => {
  const newTodo = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM list WHERE id = $1", [
      newTodo.id,
    ]);

    if (rows.length === 0) {
      const result = await pool.query(
        "INSERT INTO list (id, todo) VALUES ($1, $2) RETURNING id",
        [newTodo.id, newTodo.todo]
      );
      const id = result.rows[0].id;
      res.status(201).json({ id, todo: newTodo.todo });
    } else {
      res.status(409).send("Duplicated ID found. No entries added");
    }
  } catch (err) {
    console.error("Error adding todo:", err);
    res.status(500).send("Error adding todo");
  }
});

app.delete("/todo/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const { rowCount } = await pool.query("DELETE FROM list WHERE id = $1", [
      id,
    ]);

    if (rowCount > 0) {
      res.send(`Todo with ID ${id} has been deleted.`);
    } else {
      res.status(404).send(`Todo with id ${id} not found.`);
    }
  } catch (err) {
    console.error("Error deleting todo:", err);
    next(err);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

export default pool;
