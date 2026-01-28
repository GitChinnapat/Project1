const db = require('../config/database');

// Create moving request
const createMoving = async (req, res) => {
  try {
    const { location, type_work, detail, img, user_id, user_name } = req.body;

    console.log('📝 Receiving moving request:', { location, type_work, detail, user_id, user_name });

    // Validate required fields
    if (!location || !type_work || !detail) {
      console.log('❌ Validation failed - missing required fields (location, type_work, detail)');
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบ (location, type_work, detail)'
      });
    }

    // Validate and convert user_id to number
    const userId = Number(user_id);
    if (isNaN(userId) || userId <= 0) {
      console.log('❌ Invalid user_id:', user_id);
      return res.status(400).json({
        success: false,
        message: 'รหัสผู้ใช้ไม่ถูกต้อง'
      });
    }

    // Validate user_name is string
    const finalUserName = String(user_name || '').trim();
    if (!finalUserName) {
      console.log('❌ Invalid user_name:', user_name);
      return res.status(400).json({
        success: false,
        message: 'ชื่อผู้ใช้ไม่ถูกต้อง'
      });
    }

    const query = 'INSERT INTO moving (user_id, user_name, location, type_work, detail, img) VALUES (?, ?, ?, ?, ?, ?)';

    console.log('🔄 Executing query with values:', {
      user_id: userId,
      user_name: finalUserName,
      location,
      type_work,
      detail,
      img: img || null
    });

    const [result] = await db.execute(query, [userId, finalUserName, location, type_work, detail, img || null]);

    console.log('✅ Moving request created with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'ส่งคำขอย้ายของสำเร็จแล้ว',
      data: {
        id: result.insertId,
        user_id: userId,
        user_name: finalUserName,
        location,
        type_work,
        detail,
        img
      }
    });
  } catch (error) {
    console.error('❌ Error creating moving request:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งคำขอย้ายของ: ' + error.message,
      error: error.message
    });
  }
};

// Get all moving requests
const getAllMoving = async (req, res) => {
  try {
    const { mode } = req.query;
    let query = '';

    if (mode === 'report') {
      // Fetch all for report
      query = 'SELECT * FROM moving ORDER BY created_at DESC';
    } else {
      // Fetch active only (status != 'deleted')
      query = "SELECT * FROM moving WHERE status != 'deleted' OR status IS NULL ORDER BY created_at DESC";
    }

    const [results] = await db.execute(query);

    res.status(200).json({
      success: true,
      message: 'ข้อมูลการย้ายของทั้งหมด',
      data: results
    });
  } catch (error) {
    console.error('Error fetching moving requests:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
};

// Get moving by ID
const getMovingById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM moving WHERE move_id = ?';
    const [results] = await db.execute(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลการย้ายของ'
      });
    }

    res.status(200).json({
      success: true,
      data: results[0]
    });
  } catch (error) {
    console.error('Error fetching moving by ID:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
};

// Update moving
const updateMoving = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, type_work, detail, img, status, approved } = req.body;

    console.log('📝 Updating moving:', { id, status, approved });

    // Build dynamic query based on what fields are provided
    let updates = [];
    let values = [];

    if (location !== undefined) {
      updates.push('location = ?');
      values.push(location);
    }
    if (type_work !== undefined) {
      updates.push('type_work = ?');
      values.push(type_work);
    }
    if (detail !== undefined) {
      updates.push('detail = ?');
      values.push(detail);
    }
    if (img !== undefined) {
      updates.push('img = ?');
      values.push(img);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (approved !== undefined) {
      updates.push('approved = ?');
      values.push(approved ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ไม่มีข้อมูลที่จะอัปเดต'
      });
    }

    values.push(id);
    const query = `UPDATE moving SET ${updates.join(', ')} WHERE move_id = ?`;

    console.log('🔄 Executing query:', query, values);

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลการย้ายของ'
      });
    }

    console.log('✅ Moving updated successfully');

    res.status(200).json({
      success: true,
      message: 'อัปเดตคำขอย้ายของสำเร็จแล้ว'
    });
  } catch (error) {
    console.error('Error updating moving:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
      error: error.message
    });
  }
};

// Delete moving request
const deleteMoving = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    // Soft delete via status
    const query = "UPDATE moving SET status = 'deleted' WHERE move_id = ?";

    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Moving request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Moving request deleted successfully (Soft Delete)'
    });
  } catch (error) {
    console.error('Error deleting moving request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting moving request',
      error: error.message
    });
  }
};

module.exports = {
  createMoving,
  getAllMoving,
  getMovingById,
  updateMoving,
  deleteMoving
};
