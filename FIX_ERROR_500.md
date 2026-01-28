# 🔧 Fix Error 500 - Repair System

## ❌ ปัญหา:
```
POST /api/repair: 500 Internal Server Error
Error: Cannot read properties of undefined (reading 'toLowerCase')
```

---

## ✅ วิธีแก้ (ขั้นตอน):

### 1️⃣ รัน Diagnostic Script
```bash
cd Server
node diagnose.js
```

**ถ้าเห็น:**
- ✅ All diagnostics passed → ไปขั้นตอน 2
- ❌ repair table NOT found → ขั้นตอน 1a
- ❌ Database error → ขั้นตอน 1b

---

### 1a️⃣ ถ้าตาราง repair ไม่มี - สร้างด้วยมือ:

**เปิด MySQL Workbench หรือ MySQL CLI:**

```sql
-- ตรวจสอบว่ามีฐานข้อมูล servicereq_db หรือไม่
SHOW DATABASES;

-- ถ้าไม่มี สร้าง
CREATE DATABASE IF NOT EXISTS servicereq_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ใช้ฐานข้อมูล
USE servicereq_db;

-- สร้างตาราง repair
CREATE TABLE IF NOT EXISTS repair (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type_work VARCHAR(100) NOT NULL,
  detail TEXT NOT NULL,
  img LONGTEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตรวจสอบ
SHOW TABLES;
DESCRIBE repair;
```

---

### 1b️⃣ ถ้า Database Connection Error:

ตรวจสอบ `.env` ในโฟลเดอร์ Server:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=servicereq_db
PORT=5000
```

**ปรับค่า:**
- `DB_HOST` - ที่อยู่ MySQL (ปกติ localhost)
- `DB_USER` - username ของ MySQL (ปกติ root)
- `DB_PASS` - password ของ MySQL (ถ้าไม่มี ให้เว้นว่าง)
- `DB_NAME` - ชื่อฐานข้อมูล (servicereq_db)

---

### 2️⃣ Restart Backend Server

```bash
cd Server
npm start
```

**ต้องเห็น:**
```
✅ Database connected successfully
🔄 Initializing database tables...
✅ Repair table created or already exists
🚀 Server running on http://localhost:5000
```

---

### 3️⃣ ตรวจสอบ Frontend ว่า localStorage มี user data:

**เปิด Browser Console (F12):**
```javascript
// ตรวจสอบว่ามี user data หรือไม่
console.log(localStorage.getItem('user'));

// ต้องเห็น:
// {"id":1,"name":"สมชาย ใจดี","email":"somchai@example.com",...}

// ถ้าไม่มี → ต้องเข้าสู่ระบบ (Login) ให้สำเร็จก่อน
```

---

### 4️⃣ ทดสอบ API โดยตรง:

**เปิด Browser Console:**
```javascript
// Test API
fetch('http://localhost:5000/api/repair', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 1,
    user_name: 'Test User',
    location: 'Test Location',
    type_work: 'electric',
    detail: 'Test Detail',
    img: null
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

**ต้องเห็น:**
```json
{
  "success": true,
  "message": "แจ้งซ่อมเรียบร้อยแล้ว",
  "data": { "id": 1, "user_id": 1, "user_name": "Test User", ... }
}
```

---

### 5️⃣ ถ้ายังมี Error - ดูที่ Server Terminal:

Backend terminal ควรแสดง:
```
📝 Receiving repair request: {...}
🔄 Executing query: INSERT INTO repair...
✅ Repair created with ID: 1
```

ถ้าเห็น error ที่นี่ → อ่านข้อความ error และรีพอร์ตให้

---

## 📋 Checklist

- [ ] MySQL Server ทำงาน
- [ ] ฐานข้อมูล servicereq_db มี
- [ ] ตาราง repair สร้างแล้ว
- [ ] .env ถูกต้อง
- [ ] Backend เริ่มต้นได้
- [ ] localStorage มี user data
- [ ] API test ผ่าน

---

## 🎯 ถ้ายังไม่ได้:

1. รัน `node diagnose.js` จดผลลัพธ์
2. ดู Server Terminal หา error message
3. ส่งรูป error มา

---

## 💡 Common Issues:

| Error | ที่มา | วิธีแก้ |
|-------|-------|--------|
| 500 Internal Server Error | Table ไม่มี | สร้างตาราง |
| Cannot connect to database | .env ผิด | ตรวจสอบ credentials |
| user_id is undefined | ไม่ Login | เข้าสู่ระบบก่อน |
| ERR_NAME_NOT_RESOLVED | Backend ไม่ทำงาน | `npm start` |

