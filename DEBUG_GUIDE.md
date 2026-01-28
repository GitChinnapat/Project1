## 🔍 Debugging Guide - ระบบแจ้งซ่อม

### 1. ตรวจสอบ MySQL Connection

**ในเทอร์มินัล (Backend):**
```bash
cd Server
node -e "const db = require('./config/database'); db.getConnection().then(c => { console.log('✅ DB Connected'); c.release(); process.exit(0); }).catch(e => { console.error('❌ DB Error:', e.message); process.exit(1); })"
```

**ต้องเห็น:** `✅ DB Connected`

---

### 2. ตรวจสอบ API Server

**เปิด Browser Console:**
```javascript
// ตรวจสอบว่าเซิร์ฟเวอร์ทำงาน
fetch('http://localhost:5000')
  .then(r => r.json())
  .then(d => console.log('✅ Server OK:', d))
  .catch(e => console.error('❌ Server Error:', e.message));
```

**ต้องเห็น:** `✅ Server OK: { message: 'Server is running' }`

---

### 3. ทดสอบ Create Repair API

**เปิด Browser Console:**
```javascript
fetch('http://localhost:5000/api/repair', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'Test Location',
    type_work: 'electric',
    detail: 'Test Detail',
    img: 'test.jpg'
  })
})
.then(r => r.json())
.then(d => {
  if (d.success) {
    console.log('✅ Repair Created:', d.data);
  } else {
    console.error('❌ Error:', d.message);
  }
})
.catch(e => console.error('❌ Network Error:', e.message));
```

**ต้องเห็น:** `✅ Repair Created: { id: 1, location: '...', ... }`

---

### 4. ทดสอบ Get All Repairs

```javascript
fetch('http://localhost:5000/api/repair')
  .then(r => r.json())
  .then(d => {
    if (d.success) {
      console.log(`✅ Found ${d.data.length} repairs:`, d.data);
    } else {
      console.error('❌ Error:', d.message);
    }
  })
  .catch(e => console.error('❌ Network Error:', e.message));
```

---

### 5. ตรวจสอบในฐานข้อมูล

```sql
-- MySQL
SELECT * FROM repair;
```

---

## ❓ Common Issues

### Issue: "Cannot read properties of undefined (reading 'toLowerCase')"
**สาเหตุ:** Error object ถูก throw แต่ไม่ได้ handle ถูกต้อง
**แก้ไข:** ✅ ทำแล้ว (error handling อัปเดต)

### Issue: "ERR_NAME_NOT_RESOLVED"
**สาเหตุ:** API server ไม่ทำงาน หรือ URL ผิด
**แก้ไข:** 
- ตรวจสอบว่า `npm start` ทำงานใน Server folder
- ตรวจสอบ API_URL ใน `Client/src/services/api.js`

### Issue: "500 Internal Server Error"
**สาเหตุ:** ฐานข้อมูลมีปัญหา หรือ ตาราง `repair` ไม่มี
**แก้ไข:**
- รัน SQL script สร้างตาราง
- ตรวจสอบ `.env` credentials
- ดูที่ server terminal สำหรับ error message

### Issue: "Cannot POST /api/repair"
**สาเหตุ:** Routes ไม่ได้ register
**แก้ไข:**
- ตรวจสอบ `Server/index.js` มี `const repairRouter = require('./routes/repair');` หรือไม่
- ตรวจสอบมี `app.use('/api/repair', repairRouter);` หรือไม่

---

## 📊 Logs ที่ต้องดู

### Backend Terminal ต้องแสดง:
```
✅ Database connected successfully
🔄 Initializing database tables...
✅ Repair table created or already exists
🚀 Server running on http://localhost:5000
```

### Frontend Terminal ต้องแสดง:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

### Browser Console ต้องแสดง (เมื่อส่งฟอร์ม):
```
✅ ส่งข้อมูลการแจ้งซ่อมเรียบร้อยแล้ว!
```

---

## 🧪 Test Script

รัน automated test:
```bash
# อยู่ใน Server folder
node test-repair-api.js
```

---

## ✅ Checklist ตรวจสอบ

- [ ] MySQL Server ทำงาน (`net start MySQL80`)
- [ ] ฐานข้อมูล `servicereq_db` มี
- [ ] ตาราง `repair` สร้างแล้ว
- [ ] `.env` ถูกต้อง
- [ ] `npm install` ใน Server และ Client
- [ ] Backend เริ่มต้นได้ (port 5000)
- [ ] Frontend เริ่มต้นได้ (port 5173)
- [ ] API test ผ่าน
- [ ] Form ส่งข้อมูลได้
- [ ] ข้อมูลบันทึกในฐานข้อมูล

---

หากปัญหายังคงมี ให้ตรวจสอบจากล่างขึ้นบน (MySQL → Backend → Frontend)
