const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth'); // assuming we have the auth middleware

// Apply auth middleware to all project routes
router.use(auth);

// Get all projects for the logged-in user
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const newProject = new Project({
      title,
      description,
      user: req.user.id
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

module.exports = router;
