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
    const query = 'SELECT * FROM repair';
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

    const query = 'SELECT * FROM repair WHERE id = ?';
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
    const { location, type_work, detail, img } = req.body;

    const query = 'UPDATE repair SET location = ?, type_work = ?, detail = ?, img = ? WHERE id = ?';
    const [result] = await db.execute(query, [location, type_work, detail, img || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลแจ้งซ่อม'
      });
    }

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

// Delete repair request
const deleteRepair = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM repair WHERE id = ?';
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลแจ้งซ่อม'
      });
    }

    res.status(200).json({
      success: true,
      message: 'ลบข้อมูลแจ้งซ่อมเรียบร้อยแล้ว'
    });
  } catch (error) {
    console.error('Error deleting repair:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบ',
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
