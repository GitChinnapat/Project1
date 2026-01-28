-- Fix Repair Table Script
-- รัน scripts นี้เพื่อแก้ไขปัญหา FOREIGN KEY

USE servicereq_db;

-- ขั้นตอนที่ 1: ตรวจสอบตาราง repair มีอยู่หรือไม่
SHOW TABLES LIKE 'repair';

-- ขั้นตอนที่ 2: ลบตาราง repair เก่า (ถ้ามี)
DROP TABLE IF EXISTS repair;

-- ขั้นตอนที่ 3: สร้างตาราง repair ใหม่ (ไม่มี FOREIGN KEY)
CREATE TABLE IF NOT EXISTS `repair` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'รหัสผู้ใช้',
  `user_name` varchar(255) NOT NULL COMMENT 'ชื่อผู้แจ้งซ่อม',
  `location` varchar(255) NOT NULL COMMENT 'สถานที่',
  `type_work` varchar(100) NOT NULL COMMENT 'ประเภทงาน',
  `detail` text NOT NULL COMMENT 'รายละเอียด',
  `img` longtext COMMENT 'รูปภาพ',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ขั้นตอนที่ 4: ตรวจสอบตาราง
DESCRIBE repair;

-- ขั้นตอนที่ 5: ตรวจสอบข้อมูล
SELECT COUNT(*) as total_repairs FROM repair;
