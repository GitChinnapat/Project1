const db = require('../config/db'); // นำเข้า database connection
const bcrypt = require('bcrypt'); // ใช้ bcrypt สำหรับเข้ารหัสรหัสผ่าน

// ดึงข้อมูลผู้ใช้งานทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ดึงข้อมูลผู้ใช้งานจาก ID
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const [users] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);

    if (users.length > 0) {
      res.json(users[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// เพิ่มผู้ใช้งานใหม่
exports.createUser = async (req, res) => {
  console.log(req.body); // 🐛 ตรวจสอบว่าข้อมูลถูกส่งมาหรือไม่
  
  const { firstName, lastName, email, password, userType, phone, department, faculty } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@rmuti\.ac\.th$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email must be in the format of @rmuti.ac.th' });
  }

  try {
    const [existingUser] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query(
      'INSERT INTO users (firstName, lastName, email, password, userType, phone, department, faculty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, userType, phone, department, faculty]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        userType,
        phone,
        department,
        faculty
      }
    });

  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// อัปเดตข้อมูลผู้ใช้งาน
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    let { firstName, lastName, email, password, phone, department, faculty } = req.body;

    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let updateFields = [];
    let values = [];

    if (firstName) {
      updateFields.push("firstName = ?");
      values.push(firstName);
    }
    if (lastName) {
      updateFields.push("lastName = ?");
      values.push(lastName);
    }
    if (email) {
      email = email.trim();
      if (!/^[a-zA-Z0-9._%+-]+@rmuti\.ac\.th$/i.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      updateFields.push("email = ?");
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      values.push(hashedPassword);
    }
    if (phone) {
      updateFields.push("phone = ?");
      values.push(phone);
    }
    if (department) {
      updateFields.push("department = ?");
      values.push(department);
    }
    if (faculty) {
      updateFields.push("faculty = ?");
      values.push(faculty);
    }

    values.push(id);
    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
    const [result] = await db.promise().query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: "User updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ลบผู้ใช้งาน
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
