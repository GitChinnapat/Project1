const db = require('../config/database');
const bcrypt = require('bcrypt');

// ดึงข้อมูลผู้ใช้งานทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, lastname, date, position, phone, email FROM users');
    res.json({ success: true, users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
};

// ดึงข้อมูลผู้ใช้งานจาก ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await db.query('SELECT id, name, lastname, date, position, phone, email FROM users WHERE id = ?', [id]);

    if (users.length > 0) {
      res.json({ success: true, user: users[0] });
    } else {
      res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
};

// เพิ่มผู้ใช้งานใหม่
exports.createUser = async (req, res) => {
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

  try {
    // Check if email already exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'อีเมลนี้ถูกใช้งานแล้ว' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.query(
      'INSERT INTO users (name, lastname, date, position, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, lastname, date || null, position || null, phone || null, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      userId: result.insertId
    });

  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' 
    });
  }
};

// อัปเดตข้อมูลผู้ใช้งาน
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastname, date, position, phone, email, password } = req.body;

    // Check if user exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
    }

    let updateFields = [];
    let values = [];

    if (name) {
      updateFields.push("name = ?");
      values.push(name);
    }
    if (lastname) {
      updateFields.push("lastname = ?");
      values.push(lastname);
    }
    if (date) {
      updateFields.push("date = ?");
      values.push(date);
    }
    if (position) {
      updateFields.push("position = ?");
      values.push(position);
    }
    if (phone) {
      updateFields.push("phone = ?");
      values.push(phone);
    }
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@rmuti\.ac\.th$/i;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'รูปแบบอีเมลไม่ถูกต้อง' 
        });
      }
      updateFields.push("email = ?");
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      values.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'ไม่มีข้อมูลที่ต้องการอัปเดต' 
      });
    }

    values.push(id);
    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
    await db.query(sql, values);

    res.json({ success: true, message: "อัปเดตข้อมูลสำเร็จ" });

  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดต' });
  }
};

// ลบผู้ใช้งาน
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
    }

    res.json({ success: true, message: 'ลบผู้ใช้งานสำเร็จ' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลบ' });
  }
};