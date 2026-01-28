## 🔧 การแก้ไขปัญหา Repair System

### ❌ ปัญหา:
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
Uncaught TypeError: Cannot read properties of undefined (reading 'toLowerCase')
:5000/api/repair: 500 Internal Server Error
```

### ✅ วิธีแก้ไข:

## ขั้นตอนที่ 1: ตรวจสอบฐานข้อมูล MySQL

ตรวจสอบว่า MySQL Server ทำงานอยู่หรือไม่:

```bash
# Windows - ใช้ Services หรือ
net start MySQL80

# หรือ ตรวจสอบดังนี้
# Start → Services → ค้นหา MySQL
```

### ขั้นตอนที่ 2: สร้างฐานข้อมูล `servicereq_db`

เปิด MySQL Workbench หรือ MySQL CLI และรัน:

```sql
-- สร้างฐานข้อมูล
CREATE DATABASE IF NOT EXISTS servicereq_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ใช้ฐานข้อมูล
USE servicereq_db;

-- สร้างตาราง repair
CREATE TABLE IF NOT EXISTS repair (
  id INT NOT NULL AUTO_INCREMENT,
  location VARCHAR(255) NOT NULL COMMENT 'สถานที่/อาคาร/ชั้น',
  type_work VARCHAR(100) NOT NULL COMMENT 'ประเภทงาน',
  detail TEXT NOT NULL COMMENT 'รายละเอียด',
  img LONGTEXT COMMENT 'รูปภาพ (ชื่อไฟล์)',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้าง',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'วันที่อัปเดต',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### ขั้นตอนที่ 3: ตรวจสอบไฟล์ `.env` ในโฟลเดอร์ Server

ไฟล์ `Server/.env` ต้องมีค่า:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=servicereq_db
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**หมายเหตุ**: ปรับค่า `DB_USER` และ `DB_PASS` ให้ตรงกับ MySQL ของคุณ

### ขั้นตอนที่ 4: ติดตั้ง Dependencies และเริ่มเซิร์ฟเวอร์

```bash
# Terminal 1: Backend
cd Server
npm install
npm start

# ต้องเห็นข้อความ:
# ✅ Database connected successfully
# 🔄 Initializing database...
# ✅ Repair table initialized successfully
# 🚀 Server running on http://localhost:5000
```

```bash
# Terminal 2: Frontend
cd Client
npm install
npm run dev

# ต้องเห็นข้อความเกี่ยวกับ Vite server
```

### ขั้นตอนที่ 5: ทดสอบ API

เปิด browser console และรัน:

```javascript
// Test create repair
fetch('http://localhost:5000/api/repair', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'อาคาร A ชั้น 2',
    type_work: 'electric',
    detail: 'ไฟเสีย',
    img: 'photo.jpg'
  })
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e));
```

ควรเห็น response:
```json
{
  "success": true,
  "message": "แจ้งซ่อมเรียบร้อยแล้ว",
  "data": { "id": 1, "location": "...", ... }
}
```

---

## ❓ ที่มาของปัญหา:

1. **MySQL Server ไม่ทำงาน** → ต้องเริ่มบริการ MySQL
2. **ฐานข้อมูลไม่มี** → ต้องสร้างด้วยคำสั่ง SQL
3. **Credentials ผิด** → ตรวจสอบ `.env`
4. **Error handling ไม่ดี** → แก้ไขแล้ว

---

## 🎯 ความสำคัญของการยืนยัน:

- ✅ MySQL Server ทำงาน
- ✅ ฐานข้อมูล `servicereq_db` มีอยู่
- ✅ ตาราง `repair` ถูกสร้าง
- ✅ `.env` ถูกต้อง
- ✅ Backend server ทำงาน (localhost:5000)
- ✅ Frontend server ทำงาน (localhost:5173)

หากทำตามขั้นตอนนี้แล้ว ระบบแจ้งซ่อมจะทำงานปกติ! 🎉
