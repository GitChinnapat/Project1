const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, lastname, date, position, phone, email, password } = req.body;

    // Validate required fields
    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@rmuti\.ac\.th$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลต้องลงท้ายด้วย @rmuti.ac.th' 
      });
    }

    // Check if email already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลนี้ถูกใช้งานแล้ว' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.execute(
      'INSERT INTO users (name, lastname, date, position, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, lastname, date || null, position || null, phone || null, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' 
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'กรุณากรอกอีเมลและรหัสผ่าน' 
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@rmuti\.ac\.th$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'รูปแบบอีเมลไม่ถูกต้อง' 
      });
    }

    // Find user by email
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' 
    });
  }
});

// Get current user (requires authentication)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'ไม่พบ token' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await db.execute(
      'SELECT id, name, lastname, date, position, phone, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบข้อมูลผู้ใช้' 
      });
    }

    res.json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token ไม่ถูกต้อง' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token หมดอายุ' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาด' 
    });
  }
});

module.exports = router;