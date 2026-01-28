-- Create repair table
CREATE TABLE IF NOT EXISTS `repair` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'รหัสผู้ใช้',
  `user_name` varchar(255) NOT NULL COMMENT 'ชื่อผู้แจ้งซ่อม',
  `location` varchar(255) NOT NULL COMMENT 'สถานที่/อาคาร/ชั้น',
  `type_work` varchar(100) NOT NULL COMMENT 'ประเภทงาน',
  `detail` text NOT NULL COMMENT 'รายละเอียด',
  `img` longtext COMMENT 'รูปภาพ (ชื่อไฟล์)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Check existing data
SELECT * FROM `repair`;
