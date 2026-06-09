require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/user');
const { initScheduler } = require('./services/reminder');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trackyou';

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.warn('Continuing execution in disconnected state (check local MongoDB status).');
  });

// Start deadline reminders cron scheduler
initScheduler();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
}));

const server = app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use by another process.`);
    console.error(`   → Close the other terminal running the backend, then restart.\n`);
    process.exit(1);
  } else {
    throw err;
  }
});
