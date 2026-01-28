# 🧪 คู่มือการทดสอบระบบแจ้งซ่อม

## ขั้นตอนที่ 1: ตรวจสอบ Server

### 1.1 เปิด Terminal ใน Server folder
```bash
cd e:\Project_Final\Server
```

### 1.2 รันสคริปต์ diagnose.js เพื่อตรวจสอบฐานข้อมูล
```bash
node diagnose.js
```

**ผลลัพธ์ที่คาดหวัง:**
```
✅ MySQL Connection: Connected
✅ Database exists: servicereq_db
✅ Table exists: repair
✅ Table structure: id, user_id, user_name, location, type_work, detail, img, created_at
✅ Test insert successful
✅ Test select successful
```

## ขั้นตอนที่ 2: เริ่มต้น Server

### 2.1 ตรวจสอบว่า port 5000 ว่างหรือไม่
```bash
netstat -ano | findstr ":5000"
```

**ถ้ามี process ใช้งาน:** ให้ kill process นั้น
```bash
taskkill /PID <PID> /F
```

### 2.2 เปิด Server
```bash
npm start
```

**ผลลัพธ์ที่คาดหวัง:**
```
🚀 Server running on port 5000
📝 Initializing database...
✅ Database initialized successfully
```

## ขั้นตอนที่ 3: ทดสอบ API ด้วย Command Line

### 3.1 ทดสอบ Create Repair (POST)
```bash
curl -X POST http://localhost:5000/api/repair ^
  -H "Content-Type: application/json" ^
  -d "{\"user_id\": 1, \"user_name\": \"Test User\", \"location\": \"Room 101\", \"type_work\": \"Electrical\", \"detail\": \"Test repair\", \"img\": null}"
```

### 3.2 ทดสอบ Get All Repairs (GET)
```bash
curl http://localhost:5000/api/repair
```

### 3.3 ทดสอบ Get Repair by ID (GET)
```bash
curl http://localhost:5000/api/repair/1
```

### 3.4 ทดสอบ Update Repair (PUT)
```bash
curl -X PUT http://localhost:5000/api/repair/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"location\": \"Room 102 Updated\", \"type_work\": \"Plumbing\", \"detail\": \"Updated detail\"}"
```

### 3.5 ทดสอบ Delete Repair (DELETE)
```bash
curl -X DELETE http://localhost:5000/api/repair/1
```

## ขั้นตอนที่ 4: ทดสอบด้วย Node.js Script

### 4.1 รันสคริปต์ test-repair-api.js
```bash
node test-repair-api.js
```

**ผลลัพธ์ที่คาดหวัง:**
```
✅ Create successful
✅ Get all successful. Found X repairs
✅ Get by ID successful
✅ Update successful
✅ Delete successful
🎉 All tests passed!
```

## ขั้นตอนที่ 5: ทดสอบบน Browser Console

### 5.1 เข้าสู่ระบบก่อน
- เปิด browser ไปที่ `http://localhost:5173`
- ไปที่หน้า Login
- ล็อกอินด้วยอีเมล: `user@rmuti.ac.th` (หรืออีเมลของผู้ใช้ที่มีอยู่)

### 5.2 ตรวจสอบ localStorage
เปิด Browser Developer Console (F12) แล้วรัน:
```javascript
console.log(localStorage.getItem('user'));
```

**ผลลัพธ์ที่คาดหวัง:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@rmuti.ac.th",
  ...
}
```

### 5.3 ทดสอบ API ด้วย fetch()
```javascript
const response = await fetch('http://localhost:5000/api/repair', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 1,
    user_name: 'Test User',
    location: 'Room 101',
    type_work: 'Electrical',
    detail: 'Test from browser console',
    img: null
  })
});

const data = await response.json();
console.log(data);
```

## ขั้นตอนที่ 6: ทดสอบ Repair Form

### 6.1 ไปที่หน้า Repair
- ล็อกอินแล้ว
- ไปที่ `/repair` หรือคลิกเมนู "Repair"

### 6.2 กรอกฟอร์ม
- **สถานที่:** Room 101
- **ประเภทงาน:** Electrical
- **รายละเอียด:** Light bulb not working

### 6.3 ดูข้อมูลใน Browser Console (F12)
ควรเห็น logs เหล่านี้:
```
📝 User data from localStorage: {id: 1, name: "John Doe", ...}
✅ User validation passed: {userId: 1, userName: "John Doe"}
📤 Sending repair data: {user_id: 1, user_name: "John Doe", location: "Room 101", type_work: "Electrical", detail: "Light bulb not working", img: null}
✅ Response: {success: true, message: "แจ้งซ่อมเรียบร้อยแล้ว", data: {...}}
```

### 6.4 ดูข้อมูลใน Server Console
ควรเห็น logs เหล่านี้:
```
📝 Receiving repair request: {location: "Room 101", type_work: "Electrical", detail: "Light bulb not working", user_id: 1, user_name: "John Doe"}
✅ User validation passed: {userId: 1, userName: "John Doe"}
🔄 Executing query with values: {...}
✅ Repair created with ID: 1
```

## ขั้นตอนที่ 7: ตรวจสอบฐานข้อมูล

### 7.1 เปิด MySQL Workbench หรือ CLI

### 7.2 ตรวจสอบข้อมูล
```sql
USE servicereq_db;
SELECT * FROM repair;
DESCRIBE repair;
```

**ผลลัพธ์ที่คาดหวัง:**
- ตาราง repair มีข้อมูลที่บันทึกมาแล้ว
- Column structure ถูกต้อง: id, user_id, user_name, location, type_work, detail, img, created_at

## 🔧 Troubleshooting

### ❌ Error: "Cannot read properties of undefined (reading 'toLowerCase')"
**สาเหตุ:** ข้อมูล user_id หรือ user_name ไม่ถูกต้อง
**วิธีแก้:**
1. ตรวจสอบว่าล็อกอินแล้วหรือไม่
2. ตรวจสอบ localStorage: `console.log(localStorage.getItem('user'))`
3. ตรวจสอบ repairController.js มี validation ครบ

### ❌ Error 500: Cannot execute query
**สาเหตุ:** ตาราง repair ไม่มี column หรือ schema ไม่ตรง
**วิธีแก้:**
1. รัน `node diagnose.js` เพื่อดูโครงสร้างตาราง
2. ถ้า column ไม่ตรง ให้ใช้ `fix_repair_table.sql`
3. หรือลบและสร้างตาราง:
```sql
DROP TABLE IF EXISTS repair;
CREATE TABLE repair (
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
```

### ❌ Error: "ECONNREFUSED - Connection refused"
**สาเหตุ:** Server ไม่ทำงาน หรือ Database ไม่เชื่อมต่อ
**วิธีแก้:**
1. ตรวจสอบ Server ทำงานหรือไม่: `netstat -ano | findstr ":5000"`
2. เปิด Server: `npm start` ในโฟลเดอร์ Server
3. ตรวจสอบ MySQL ทำงานหรือไม่
4. ตรวจสอบ config/database.js ว่าการเชื่อมต่อถูกต้อง

### ❌ Error: "Unexpected token < in JSON at position 0"
**สาเหตุ:** Server ส่ง HTML แทน JSON (อาจจากหน้า error)
**วิธีแก้:**
1. ตรวจสอบ URL ว่าถูกต้องหรือไม่
2. ตรวจสอบ Server ทำงานถูกต้องหรือไม่
3. ดู Server logs เพื่อดูข้อมูลข้อผิดพลาด

## ✅ ขั้นตอนการยืนยันเสร็จสิ้น

เมื่อทั้งหมดข้างต้นทำงานสำเร็จแล้ว:
- ✅ Database เชื่อมต่อถูกต้อง
- ✅ API ส่งและรับข้อมูลถูกต้อง
- ✅ Form บันทึกข้อมูลในฐานข้อมูลแล้ว
- ✅ RepairList แสดงข้อมูลแล้ว
- ✅ ระบบแจ้งซ่อมใช้งานได้อย่างเต็มที่

---

**หมายเหตุ:** ทดสอบขั้นตอนต่าง ๆ ตามลำดับเพื่อให้หาจุดบกพร่องได้ง่ายขึ้น
