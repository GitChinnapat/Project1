const fs = require('fs');
const path = require('path');

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload image from base64
const uploadImageBase64 = async (req, res) => {
  try {
    const { imageData, fileName } = req.body;

    if (!imageData || !fileName) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาส่ง imageData และ fileName'
      });
    }

    // Remove data URI prefix if exists
    let base64Data = imageData;
    if (imageData.includes(',')) {
      base64Data = imageData.split(',')[1];
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    // Convert base64 to buffer and save
    const imageBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, imageBuffer);

    console.log('✅ Image uploaded:', uniqueFileName);

    res.status(200).json({
      success: true,
      message: 'อัพโหลดรูปภาพสำเร็จ',
      data: {
        fileName: uniqueFileName,
        fileUrl: `/uploads/${uniqueFileName}`,
        filePath: filePath
      }
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error.message);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ',
      error: error.message
    });
  }
};

// Delete image file
const deleteImage = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาส่ง fileName'
      });
    }

    const filePath = path.join(uploadsDir, fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบไฟล์รูปภาพ'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    console.log('✅ Image deleted:', fileName);

    res.status(200).json({
      success: true,
      message: 'ลบรูปภาพสำเร็จ'
    });
  } catch (error) {
    console.error('❌ Error deleting image:', error.message);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบรูปภาพ',
      error: error.message
    });
  }
};

module.exports = {
  uploadImageBase64,
  deleteImage
};
