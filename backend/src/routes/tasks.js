const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all task routes
router.use(authMiddleware);

// Get All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
});

// Create Task
router.post('/', async (req, res) => {
  const { title, description, deadline } = req.body;
  if (!title || !deadline) {
    return res.status(400).json({ message: 'Title and deadline are required' });
  }

  // Validate date before passing to Mongoose
  const parsedDeadline = new Date(deadline);
  if (isNaN(parsedDeadline.getTime())) {
    return res.status(400).json({ message: 'Invalid deadline date. Please provide a valid date and time.' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      deadline: parsedDeadline,
      userId: req.user.id
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Update Task (Toggle completed, title, etc)
router.put('/:id', async (req, res) => {
  const { title, description, deadline, completed } = req.body;
  try {
    let task = await Task.findOne({ _id: req.id || req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline !== undefined) {
      const parsedDeadline = new Date(deadline);
      if (!isNaN(parsedDeadline.getTime())) {
        task.deadline = parsedDeadline;
      }
    }
    if (completed !== undefined) {
      task.completed = completed;
      // If completed state is flipped back to false, allow email reminder notifications to fire again
      if (!completed) task.emailNotified = false;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    res.json({ message: 'Task deleted successfully', taskId: req.params.id });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
