require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const initializeDatabase = require('./config/initialize');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploads folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
initializeDatabase();

// Import routes
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const repairRouter = require('./routes/repair');
const movingRouter = require('./routes/moving');
const uploadRouter = require('./routes/upload');

// Use routes
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/repair', repairRouter);
app.use('/api/moving', movingRouter);
app.use('/api/upload', uploadRouter);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});