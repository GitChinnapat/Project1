# ✅ ตรวจสอบและทดสอบระบบแจ้งซ่อม

## 1️⃣ ตรวจสอบตาราง repair ใน MySQL

**เปิด MySQL Workbench หรือ MySQL CLI:**

```sql
USE servicereq_db;

-- ตรวจสอบตาราง
SHOW TABLES;

-- ดูโครงสร้างตาราง repair
DESCRIBE repair;

-- ตรวจสอบข้อมูล
SELECT * FROM repair;
```

---

## 2️⃣ ทดสอบ Backend API

**เปิด PowerShell/Terminal ที่โฟลเดอร์ Server:**

```bash
# ตรวจสอบ database connection
node diagnose.js
```

**ต้องเห็น:**
```
✅ Database connected
✅ repair table found
✅ Latest repair: {...}
✅ All diagnostics passed!
```

---

## 3️⃣ ทดสอบ API ด้วย Browser Console

**ขั้นตอน:**
1. เปิด http://localhost:5173 (Frontend)
2. เข้าสู่ระบบ (Login)
3. เปิด Browser Console (F12 → Console)
4. รันคำสั่ง:

```javascript
// ตรวจสอบ localStorage
const user = JSON.parse(localStorage.getItem('user'));
console.log('User data:', user);

// ต้องเห็น: { id: 1, name: "...", email: "...", ... }
```

---

## 4️⃣ ทดสอบ Create Repair API

**ใน Browser Console:**

```javascript
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
.then(d => {
  console.log('Status:', d.success ? '✅ Success' : '❌ Failed');
  console.log('Response:', d);
})
.catch(e => console.error('❌ Error:', e));
```

**ต้องเห็น:**
```
Status: ✅ Success
Response: { success: true, message: "แจ้งซ่อมเรียบร้อยแล้ว", data: {...} }
```

---

## 5️⃣ ทดสอบ Get All Repairs API

```javascript
fetch('http://localhost:5000/api/repair')
  .then(r => r.json())
  .then(d => {
    console.log(`Found ${d.data.length} repairs:`, d.data);
  })
  .catch(e => console.error('Error:', e));
```

---

## 6️⃣ ตรวจสอบใน MySQL ว่าข้อมูลบันทึกลงไปหรือไม่

```sql
USE servicereq_db;
SELECT * FROM repair ORDER BY id DESC LIMIT 5;
```

---

## 🔍 ถ้ายังมีปัญหา

| สัญลักษณ์ | ปัญหา | วิธีแก้ |
|---------|-------|--------|
| ❌ Database error | Database ไม่ทำงาน | ตรวจสอบ `.env` credentials |
| ❌ Table not found | ตาราง repair ไม่มี | รัน `fix_repair_table.sql` |
| ❌ 500 error | Backend error | ดู Server terminal หา error |
| ❌ user_id undefined | ไม่ login | ต้อง Login ให้สำเร็จ |
| ❌ CORS error | Frontend ไปผิด URL | ตรวจสอบ API_URL ใน api.js |

---

## ✅ Checklist

- [ ] ตาราง repair มี
- [ ] Backend เริ่มต้นได้
- [ ] localStorage มี user data
- [ ] API test ผ่าน
- [ ] ข้อมูลบันทึกใน database ได้

