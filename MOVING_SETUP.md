# 🔧 Moving System - Setup Guide

## ⚡ ขั้นตอนการตั้งค่า Moving System

### Step 1: สร้างตาราง Moving ในฐานข้อมูล

#### วิธี A: ใช้ MySQL Workbench หรือ CLI
```bash
# เปิด MySQL
mysql -u root -p

# เลือก database
USE servicereq_db;

# รัน SQL ตามไฟล์ Server/moving.sql
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
```

#### วิธี B: Auto-create (เมื่อเปิด Server)
- ตาราง moving จะถูกสร้างอัตโนมัติเมื่อเปิด Server
- ตรวจสอบ Server logs ว่าบอกว่า "✅ Moving table created or already exists"

---

### Step 2: ตรวจสอบไฟล์ที่สร้าง

#### Backend Files
```
✅ Server/controllers/movingController.js    (CRUD operations)
✅ Server/routes/moving.js                   (API endpoints)
✅ Server/moving.sql                         (Table creation)
✅ Server/config/initialize.js               (Updated)
✅ Server/index.js                           (Updated with moving routes)
```

#### Frontend Files
```
✅ Client/src/page/Moving.jsx                (Moving form)
✅ Client/src/page/MovingList.jsx            (Display list)
✅ Client/src/services/api.js                (Updated with movingAPI)
✅ Client/src/routes/GuestRoutes.jsx         (Updated with routes)
```

---

### Step 3: เปิด Server และ Client

#### Terminal 1: Backend
```bash
cd e:\Project_Final\Server
npm start

# Expected output:
# ✅ Database connected successfully
# ✅ Moving table created or already exists
# 🚀 Server running on http://localhost:5000
```

#### Terminal 2: Frontend
```bash
cd e:\Project_Final\Client
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

---

### Step 4: ทดสอบระบบ

#### Test 1: ส่งคำขอย้ายของ
1. เปิด http://localhost:5173/RMUTI
2. ล็อกอิน
3. ไปที่ "ขนย้าย / จัดสถานที่"
4. กรอกข้อมูล
5. คลิก "ตกลง"
6. ควรเห็น "ส่งคำขอย้ายของสำเร็จแล้ว"

#### Test 2: ดูรายการคำขอ
1. ไปที่ "รายการย้ายของ" หรือ `/RMUTI/MovingList`
2. ควรเห็นคำขอที่เพิ่งส่ม
3. สามารถคลิก "ลบ" เพื่อลบได้

#### Test 3: ตรวจสอบฐานข้อมูล
```bash
# ใช้ MySQL CLI
USE servicereq_db;
SELECT * FROM moving;

# ควรเห็นข้อมูลที่เพิ่งส่ง
```

---

### Step 5: ตรวจสอบ Server Logs

เมื่อส่งคำขอ ควรเห็นใน Server console:
```
📝 Receiving moving request: {location: "...", type_work: "...", ...}
✅ User validation passed: {userId: 1, userName: "..."}
🔄 Executing query with values: {...}
✅ Moving request created with ID: 1
```

---

### Step 6: ตรวจสอบ Browser Console

เมื่อส่งคำขอ ควรเห็นใน Browser Console (F12):
```
📝 User data from localStorage: {id: 1, name: "...", ...}
✅ User validation passed: {userId: 1, userName: "..."}
📤 Sending moving data: {...}
✅ Response: {success: true, message: "...", data: {...}}
```

---

## ✅ Verification Checklist

- [ ] Server ทำงาน (port 5000)
- [ ] Client ทำงาน (port 5173)
- [ ] ตาราง moving สร้างแล้ว
- [ ] ล็อกอินได้
- [ ] ส่งคำขอย้ายสำเร็จ
- [ ] ข้อมูลปรากฏในฐานข้อมูล
- [ ] MovingList page แสดงข้อมูล
- [ ] สามารถลบคำขอได้

---

## 🔧 Troubleshooting

### ❌ Error: "Table 'moving' doesn't exist"
```bash
# Fix: Run the SQL manually
mysql -u root servicereq_db < Server/moving.sql

# Or copy-paste the SQL from MOVING_SYSTEM_README.md
```

### ❌ Error: "Cannot find module 'movingController'"
- ตรวจสอบว่า `Server/controllers/movingController.js` มีอยู่
- ตรวจสอบ path ใน `Server/routes/moving.js`

### ❌ Error: "Module not found: MovingList"
- ตรวจสอบว่า `Client/src/page/MovingList.jsx` มีอยู่
- ตรวจสอบ import path ใน `Client/src/routes/GuestRoutes.jsx`

### ❌ Moving form ไม่ส่งข้อมูล
1. ตรวจสอบ Browser Console ว่ามี error ไหม
2. ตรวจสอบ Server logs ว่ามี error ไหม
3. ล็อกอินใหม่เพื่อให้ localStorage มี user data

---

## 🎉 Success Indicators

### Client-side
- ✅ Form submit ได้
- ✅ เห็น success message
- ✅ Form reset หลังจากส่ง
- ✅ Browser console ไม่มี error

### Server-side
- ✅ Logs แสดงตัวเลขรหัสใหม่
- ✅ Response เป็น JSON format ที่ถูกต้อง
- ✅ ไม่มี error ใน console

### Database
- ✅ ตาราง moving มีข้อมูล
- ✅ move_id auto-increment ทำงาน
- ✅ created_at มี timestamp อัตโนมัติ

---

## 📝 API Testing

### ทดสอบด้วย cURL

```bash
# 1. Create
curl -X POST http://localhost:5000/api/moving \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "user_name": "Test User",
    "location": "Room 101",
    "type_work": "Moving",
    "detail": "Test moving",
    "img": null
  }'

# 2. Get all
curl http://localhost:5000/api/moving

# 3. Get by ID
curl http://localhost:5000/api/moving/1

# 4. Update
curl -X PUT http://localhost:5000/api/moving/1 \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Room 102",
    "type_work": "Moving",
    "detail": "Updated detail"
  }'

# 5. Delete
curl -X DELETE http://localhost:5000/api/moving/1
```

---

## 🚀 Next Steps

หลังจากตั้งค่าเสร็จ:

1. **ทดสอบระบบสมบูรณ์** - ลองใช้งานตามคู่มือ
2. **เพิ่มฟีเจอร์เพิ่มเติม** - เช่น edit form, filter list
3. **สตรเวอร์** - Deploy ไปเซิร์ฟเวอร์จริง
4. **ติดตามข้อมูล** - ตรวจสอบ logs และ database ตามระหว่าง

---

**เสร็จแล้ว! Moving System พร้อมใช้งาน ✅**

สำหรับคำถามเพิ่มเติม ดู `MOVING_SYSTEM_README.md`
