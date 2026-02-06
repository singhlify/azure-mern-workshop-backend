const Todo = require('../models/Todo');
const mongoose = require('mongoose');

/**
 * Create a new todo
 * POST /api/todos
 */
const createTodo = async (req, res) => {
  try {
    const { title } = req.body;

    // Validate title
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'title is required',
      });
    }

    const todo = await Todo.create({ title: title.trim() });

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message,
    });
  }
};

/**
 * Get all todos
 * GET /api/todos
 */
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message,
    });
  }
};

/**
 * Update a todo
 * PATCH /api/todos/:id
 */
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isCompleted } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo id',
      });
    }

    // Build update object (only include fields that are provided)
    const updateData = {};
    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'title cannot be empty',
        });
      }
      updateData.title = title.trim();
    }
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
    }

    const todo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message,
    });
  }
};

/**
 * Delete a todo
 * DELETE /api/todos/:id
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo id',
      });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message,
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};
