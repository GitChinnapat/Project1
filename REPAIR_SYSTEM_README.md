# ระบบแจ้งซ่อม (Repair Notification System)

## สรุป
ระบบแจ้งซ่อมที่สมบูรณ์พร้อมใช้งาน ผู้ใช้สามารถแจ้งซ่อมโดยกรอกข้อมูลต่อไปนี้:
- **สถานที่**: ตำแหน่งที่ต้องซ่อม (อาคาร ชั้น ห้อง)
- **ประเภทงาน**: เลือกจากตัวเลือก (ไฟฟ้า, ประปา, เครื่องปรับอากาศ, เฟอร์นิเจอร์, คอมพิวเตอร์, อื่นๆ)
- **รายละเอียด**: รายละเอียดเพิ่มเติมเกี่ยวกับปัญหา
- **รูปภาพ**: อัปโหลดรูปภาพของปัญหา (ไม่บังคับ)

## ไฟล์ที่สร้าง

### Backend (Server)

#### 1. Controller: `Server/controllers/repairController.js`
จัดการฟังก์ชันหลักของระบบแจ้งซ่อม:
- `createRepair()` - สร้างคำแจ้งซ่อมใหม่
- `getAllRepairs()` - ดึงข้อมูลคำแจ้งซ่อมทั้งหมด
- `getRepairById()` - ดึงข้อมูลคำแจ้งซ่อมตามรหัส
- `updateRepair()` - อัปเดตข้อมูลคำแจ้งซ่อม
- `deleteRepair()` - ลบคำแจ้งซ่อม

#### 2. Routes: `Server/routes/repair.js`
เส้นทาง API สำหรับการแจ้งซ่อม:
- `POST /api/repair` - สร้างแจ้งซ่อมใหม่
- `GET /api/repair` - ดูทั้งหมด
- `GET /api/repair/:id` - ดูตามรหัส
- `PUT /api/repair/:id` - แก้ไข
- `DELETE /api/repair/:id` - ลบ

#### 3. Database: `Server/database.sql`
SQL script สำหรับสร้างตาราง `repair`

### Frontend (Client)

#### 1. Page: `Client/src/page/Repair.jsx` (แก้ไข)
ปรับปรุงหน้าแจ้งซ่อมให้ทำงานจริง:
- เพิ่มการตรวจสอบข้อมูล (validation)
- ดึงข้อมูลผู้ใช้จาก localStorage
- เชื่อมต่อกับ API backend
- แสดงข้อความสำเร็จ/ข้อผิดพลาด
- ปิดการโต้ตอบระหว่างส่งข้อมูล (loading state)

#### 2. Page: `Client/src/page/RepairList.jsx` (ใหม่)
หน้าแสดงรายการแจ้งซ่อม:
- แสดงรายการแจ้งซ่อมทั้งหมด
- แสดงชื่อผู้แจ้ง สถานที่ ประเภทงาน รายละเอียด
- ปุ่มลบและแก้ไข
- โหลดข้อมูลอัตโนมัติ

#### 2. API Service: `Client/src/services/api.js` (อัปเดต)
เพิ่ม `repairAPI` object:
- `createRepair()` - ส่งข้อมูลแจ้งซ่อม
- `getAllRepairs()` - ดึงข้อมูลทั้งหมด
- `getRepairById()` - ดึงข้อมูลตามรหัส
- `updateRepair()` - อัปเดต
- `deleteRepair()` - ลบ

### Server: `Server/index.js` (อัปเดต)
เพิ่ม repair routes เข้าในเซิร์ฟเวอร์

## วิธีใช้งาน

### 1. ตั้งค่าฐานข้อมูล
ทำการสร้างตาราง `repair` โดยรัน SQL commands จาก `Server/database.sql` ในฐานข้อมูล MySQL

```sql
CREATE TABLE IF NOT EXISTS `repair` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'รหัสผู้ใช้',
  `user_name` varchar(255) NOT NULL COMMENT 'ชื่อผู้แจ้งซ่อม',
  `location` varchar(255) NOT NULL,
  `type_work` varchar(100) NOT NULL,
  `detail` text NOT NULL,
  `img` longtext,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. เริ่มเซิร์ฟเวอร์ Backend
```bash
cd Server
npm install  # ถ้ายังไม่ได้ติดตั้ง
npm start    # เริ่มเซิร์ฟเวอร์ที่ localhost:5000
```

### 3. เริ่มเซิร์ฟเวอร์ Frontend
```bash
cd Client
npm install  # ถ้ายังไม่ได้ติดตั้ง
npm run dev  # เริ่มเซิร์ฟเวอร์พัฒนา
```

### 4. ใช้งานระบบ
**ขั้นตอนที่สำคัญ:**
1. เข้าสู่ระบบ (Login) ให้สำเร็จ - ข้อมูลผู้ใช้จะเก็บใน localStorage
2. ไปยังหน้า `/repair` ในเบราว์เซอร์
3. กรอกข้อมูล:
   - **สถานที่**: กรอกสถานที่ที่ต้องซ่อม
   - **ประเภทงาน**: เลือกประเภท
   - **รายละเอียด**: อธิบายปัญหาโดยละเอียด
   - **รูปภาพ**: (ไม่บังคับ) คลิกเพื่ออัปโหลดรูป
4. คลิก **ตกลง** เพื่อส่งข้อมูล
5. ระบบจะแสดงข้อความสำเร็จและข้อมูลจะบันทึกในฐานข้อมูลพร้อมชื่อผู้แจ้ง

### 5. ดูรายการแจ้งซ่อม
- ไปยังหน้า `/repair-list` เพื่อดูรายการแจ้งซ่อมทั้งหมด
- แสดงชื่อผู้แจ้ง สถานที่ ประเภทงาน รายละเอียด วันที่แจ้ง

## API Endpoints

### สร้างแจ้งซ่อมใหม่
```
POST /api/repair
Content-Type: application/json

{
  "user_id": 1,
  "user_name": "สมชาย ใจดี",
  "location": "อาคาร A ชั้น 2 ห้อง 201",
  "type_work": "electric",
  "detail": "เต้าเสียบไฟเสีย",
  "img": "photo1.jpg, photo2.jpg"
}
```

### ดูข้อมูลทั้งหมด
```
GET /api/repair
```

### ดูข้อมูลตามรหัส
```
GET /api/repair/1
```

### อัปเดตข้อมูล
```
PUT /api/repair/1
Content-Type: application/json

{
  "location": "อาคาร B ชั้น 3",
  "type_work": "plumbing",
  "detail": "ท่อประปาแตก",
  "img": "photo3.jpg"
}
```

### ลบข้อมูล
```
DELETE /api/repair/1
```

## ตัวอย่างข้อมูลในฐานข้อมูล

```
id | user_id | user_name    | location        | type_work | detail        | created_at
1  | 1       | สมชาย ใจดี   | อาคาร A ชั้น 2  | electric  | เต้าเสียบไฟ   | 2024-12-24
2  | 2       | สมหญิง สวย   | อาคาร B ชั้น 3  | plumbing  | ท่อประปาแตก   | 2024-12-24
```

## หมายเหตุ
- **ต้องเข้าสู่ระบบก่อน** - ระบบจะดึงข้อมูลผู้ใช้จาก localStorage ที่เก็บขณะ login
- ชื่อผู้แจ้งซ่อมจะดึงมาจาก `user.name` หรือ `user.email` จากข้อมูลผู้ใช้ที่เก็บใน localStorage
- รหัสผู้ใช้ (`user_id`) จะเชื่อมโยงกับตาราง `users` โดย Foreign Key
- ไฟล์รูปภาพจะเก็บเป็นชื่อไฟล์ในปัจจุบัน หากต้องการเก็บไฟล์จริง ต้องสร้างระบบ upload ไฟล์เพิ่มเติม
- ตรวจสอบให้แน่ใจว่าข้อมูลสถานที่ ประเภทงาน และรายละเอียดมีความเหมาะสม
- ถ้าเกิดข้อผิดพลาด ระบบจะแสดงข้อความแจ้งให้ทราบ
- ดูรายการแจ้งซ่อมทั้งหมดได้ที่หน้า `/repair-list`
