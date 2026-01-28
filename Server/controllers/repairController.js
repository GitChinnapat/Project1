const db = require('../config/database');

// Create repair request
const createRepair = async (req, res) => {
  try {
    const { location, type_work, detail, img, user_id, user_name } = req.body;

    console.log('📝 Receiving repair request:', { location, type_work, detail, user_id, user_name });

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

    const query = 'INSERT INTO repair (user_id, user_name, location, type_work, detail, img) VALUES (?, ?, ?, ?, ?, ?)';

    console.log('🔄 Executing query with values:', {
      user_id: userId,
      user_name: finalUserName,
      location,
      type_work,
      detail,
      img: img || null
    });

    const [result] = await db.execute(query, [userId, finalUserName, location, type_work, detail, img || null]);

    console.log('✅ Repair created with ID:', result.insertId);

    res.status(201).json({
      success: true,
      message: 'แจ้งซ่อมเรียบร้อยแล้ว',
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
    console.error('❌ Error creating repair:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Full error object:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการแจ้งซ่อม: ' + error.message,
      error: error.message
    });
  }
};

// Get all repair requests
const getAllRepairs = async (req, res) => {
  try {
    // Check if we want all records (for report) or only active ones
    const { mode } = req.query;
    let query = '';

    if (mode === 'report') {
      // Fetch all (active + deleted)
      query = 'SELECT * FROM repair ORDER BY created_at DESC';
    } else {
      // Active only = status is NOT 'deleted'
      query = "SELECT * FROM repair WHERE status != 'deleted' OR status IS NULL ORDER BY created_at DESC";
    }

    const [results] = await db.execute(query);

    res.status(200).json({
      success: true,
      message: 'ข้อมูลแจ้งซ่อมทั้งหมด',
      data: results
    });
  } catch (error) {
    console.error('Error fetching repairs:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
};

// Get repair by ID
const getRepairById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM repair WHERE id_repair = ?';
    const [results] = await db.execute(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลแจ้งซ่อม'
      });
    }

    res.status(200).json({
      success: true,
      message: 'ข้อมูลแจ้งซ่อม',
      data: results[0]
    });
  } catch (error) {
    console.error('Error fetching repair:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error.message
    });
  }
};

// Update repair request
const updateRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, type_work, detail, img, status, approved } = req.body;

    console.log('📝 Updating repair:', { id, status, approved });

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
    const query = `UPDATE repair SET ${updates.join(', ')} WHERE id_repair = ?`;

    console.log('🔄 Executing query:', query, values);

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลแจ้งซ่อม'
      });
    }

    console.log('✅ Repair updated successfully');

    res.status(200).json({
      success: true,
      message: 'อัปเดตข้อมูลแจ้งซ่อมเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Error updating repair:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดต',
      error: error.message
    });
  }
};

// Delete repair request (Soft Delete via Status)
const deleteRepair = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'รหัสแจ้งซ่อมไม่ถูกต้อง'
      });
    }

    // Soft delete by updating status
    const query = "UPDATE repair SET status = 'deleted' WHERE id_repair = ?";

    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลแจ้งซ่อม'
      });
    }

    res.status(200).json({
      success: true,
      message: 'ลบข้อมูลเรียบร้อยแล้ว (Soft Delete)'
    });
  } catch (error) {
    console.error('Error deleting repair:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
      error: error.message
    });
  }
};

module.exports = {
  createRepair,
  getAllRepairs,
  getRepairById,
  updateRepair,
  deleteRepair
};
