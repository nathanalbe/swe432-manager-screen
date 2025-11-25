// Main Server File - Express Application
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Import database connection
const connectDB = require('./models/db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration with MongoDB store
// Check if MONGODB_URI is loaded
const mongoUrl = process.env.MONGODB_URI;
if (!mongoUrl) {
  console.warn('⚠️  Warning: MONGODB_URI not found in environment variables');
  console.warn('   Make sure .env file exists with MONGODB_URI set');
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  store: mongoUrl ? MongoStore.create({
    mongoUrl: mongoUrl,
    collectionName: 'sessions'
  }) : undefined, // Fallback to memory store if no MongoDB URI
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false // Set to true in production with HTTPS
  }
}));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const scheduleRoutes = require('./routes/schedule');
const reportRoutes = require('./routes/report');

// Routes
// Home page
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Pulse 98.7 Radio Station - Home'
  });
});

// Schedule routes
app.use('/schedule', scheduleRoutes);

// Report routes
app.use('/report', reportRoutes);

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

// Basic route for testing
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    database: 'MongoDB Atlas',
    session: req.sessionID ? 'Session active' : 'No session'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

