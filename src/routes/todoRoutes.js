const express = require('express');
const router = express.Router();
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

// POST /api/todos - Create a new todo
router.post('/', createTodo);

// GET /api/todos - Get all todos
router.get('/', getTodos);

// PATCH /api/todos/:id - Update a todo
router.patch('/:id', updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', deleteTodo);

module.exports = router;
