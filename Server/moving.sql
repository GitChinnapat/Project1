-- Create moving table for moving requests
CREATE TABLE IF NOT EXISTS moving (
  move_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT 'รหัสผู้ใช้',
  user_name VARCHAR(255) NOT NULL COMMENT 'ชื่อผู้ขอย้ายของ',
  location VARCHAR(255) NOT NULL COMMENT 'สถานที่ย้ายไป',
  type_work VARCHAR(100) NOT NULL COMMENT 'ประเภทงาน',
  detail TEXT NOT NULL COMMENT 'รายละเอียด',
  img LONGTEXT COMMENT 'รูปภาพ',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
  PRIMARY KEY (move_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
