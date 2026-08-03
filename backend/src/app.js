const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const candidateRoutes = require('./routes/candidate');
const voteRoutes = require('./routes/vote');
const registrationRoutes = require('./routes/registration');
const announcementRoutes = require('./routes/announcement');
const statisticsRoutes = require('./routes/statistics');
const userRoutes = require('./routes/user');
const periodRoutes = require('./routes/period');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/candidate', candidateRoutes);
app.use('/vote', voteRoutes);
app.use('/registration', registrationRoutes);
app.use('/announcement', announcementRoutes);
app.use('/users', userRoutes);
app.use('/period', periodRoutes);
app.use('/', statisticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sistem Informasi Pemilihan OSIS API is running.' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Sistem Informasi Pemilihan OSIS Backend API');
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
