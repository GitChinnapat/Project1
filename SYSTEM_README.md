# 📋 ระบบแจ้งซ่อม - คู่มือการใช้งาน

## 🎯 บรรยายระบบ

ระบบแจ้งซ่อมนี้เป็นเว็บแอปพลิเคชันที่ช่วยให้ผู้ใช้สามารถ:
1. **ส่งแจ้งขอซ่อม** ด้วยรายละเอียดสถานที่ ประเภทงาน และรายละเอียดปัญหา
2. **ดูประวัติการแจ้งซ่อม** ที่ได้ส่งมาแล้ว
3. **ติดตามสถานะการซ่อม** โดยอัตโนมัติ

---

## 📦 ส่วนประกอบของระบบ

### Backend (Node.js + Express)
- **Database:** MySQL with `servicereq_db`
- **Port:** 5000
- **Routes:**
  - `POST /api/repair` - สร้างแจ้งซ่อมใหม่
  - `GET /api/repair` - ดึงข้อมูลแจ้งซ่อมทั้งหมด
  - `GET /api/repair/:id` - ดึงแจ้งซ่อมตามรหัส
  - `PUT /api/repair/:id` - อัปเดตแจ้งซ่อม
  - `DELETE /api/repair/:id` - ลบแจ้งซ่อม

### Frontend (React + Vite)
- **Port:** 5173
- **Pages:**
  - `/repair` - แบบฟอร์มส่งแจ้งซ่อม
  - `/repair-list` - ดูรายการแจ้งซ่อม

### Database
- **Table:** `repair`
- **Columns:** 
  - `id` - รหัสแจ้งซ่อม (Auto-increment)
  - `user_id` - รหัสผู้แจ้ง
  - `user_name` - ชื่อผู้แจ้ง
  - `location` - สถานที่ซ่อม
  - `type_work` - ประเภทงาน
  - `detail` - รายละเอียด
  - `img` - รูปภาพ (ชื่อไฟล์)
  - `created_at` - วันที่บันทึก

---

## 🚀 วิธีการเริ่มต้น

### ความต้องการ
- Node.js v16+ 
- MySQL Server 8.0+
- npm หรือ yarn

### ขั้นตอน

#### 1. สร้างฐานข้อมูล
```bash
# เปิด MySQL CLI หรือ Workbench แล้วรัน
CREATE DATABASE IF NOT EXISTS servicereq_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE servicereq_db;
```

#### 2. ติดตั้ง Backend
```bash
cd e:\Project_Final\Server
npm install
npm start
```

**ผลลัพธ์ที่คาดหวัง:**
```
✅ Database connected successfully
✅ Database initialized successfully
🚀 Server running on port 5000
```

#### 3. ติดตั้ง Frontend
```bash
cd e:\Project_Final\Client
npm install
npm run dev
```

**ผลลัพธ์ที่คาดหวัง:**
```
VITE v... ready in ... ms
➜  Local: http://localhost:5173/
```

#### 4. เข้าใช้งาน
1. เปิด `http://localhost:5173` ในเบราว์เซอร์
2. ล็อกอินด้วยอีเมล `@rmuti.ac.th`
3. ไปที่ "/Repair" เพื่อส่งแจ้งซ่อม

---

## 🔧 ตัวแปร Environment

### Server/.env
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=servicereq_db
PORT=5000
JWT_SECRET=your_secret_key
```

### Client/.env (ถ้าจำเป็น)
```env
VITE_API_URL=http://localhost:5000
```

---

## 💾 Database Schema

```sql
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

---

## 📝 API Examples

### ส่งแจ้งซ่อมใหม่
```bash
curl -X POST http://localhost:5000/api/repair \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "user_name": "John Doe",
    "location": "Room 101",
    "type_work": "Electrical",
    "detail": "Light bulb not working",
    "img": null
  }'
```

### ดึงข้อมูลแจ้งซ่อมทั้งหมด
```bash
curl http://localhost:5000/api/repair
```

### ดึงแจ้งซ่อมตามรหัส
```bash
curl http://localhost:5000/api/repair/1
```

### อัปเดตแจ้งซ่อม
```bash
curl -X PUT http://localhost:5000/api/repair/1 \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Room 102",
    "type_work": "Plumbing",
    "detail": "Pipe repair needed"
  }'
```

### ลบแจ้งซ่อม
```bash
curl -X DELETE http://localhost:5000/api/repair/1
```

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot read properties of undefined"
**สาเหตุ:** ข้อมูล user ไม่ถูกต้องหรือล็อกอินยังไม่สำเร็จ

**วิธีแก้:**
1. ตรวจสอบว่าล็อกอินแล้ว
2. เปิด Browser Console (F12) แล้วรัน: `console.log(localStorage.getItem('user'))`
3. ควรเห็นข้อมูล user object

### ❌ Error 500: Internal Server Error
**สาเหตุ:** ปัญหาใน database query

**วิธีแก้:**
1. ตรวจสอบ Server logs ว่ามี error อะไร
2. รัน `node diagnose.js` เพื่อทดสอบ database
3. ตรวจสอบ MySQL ทำงาน: `mysql -u root`

### ❌ Error: "ECONNREFUSED"
**สาเหตุ:** Server หรือ Database ไม่ทำงาน

**วิธีแก้:**
1. ตรวจสอบ Server ทำงาน: `netstat -ano | findstr ":5000"`
2. ตรวจสอบ MySQL ทำงาน: `netstat -ano | findstr ":3306"`
3. เปิด Server และ MySQL ใหม่

### ❌ Error: "Table 'repair' doesn't exist"
**สาเหตุ:** ตาราง repair ยังไม่ถูกสร้าง

**วิธีแก้:**
1. รีสตาร์ท Server จะสร้างตารางอัตโนมัติ
2. หรือรัน SQL ด้วยมือ (ดู Database Schema ด้านบน)

### ❌ Error: "Access denied for user 'root'@'localhost'"
**สาเหตุ:** รหัสผ่าน MySQL ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบ Server/.env ว่า `DB_PASS` ถูกต้อง
2. ตรวจสอบรหัสผ่าน MySQL ของคุณ
3. เปลี่ยนรหัสผ่านหรือใช้ไม่มีรหัสผ่าน (สำหรับพัฒนา)

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Web Browser                        │
│    http://localhost:5173                    │
└────────────────────┬────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
┌────────▼─────────────┐  ┌──────▼──────────────┐
│  React Frontend      │  │  Browser Storage    │
│  (Client)            │  │  localStorage       │
│                      │  │  (user data)        │
│  - Repair.jsx        │  │                     │
│  - RepairList.jsx    │  │                     │
└────────┬─────────────┘  └─────────────────────┘
         │
         │ HTTP/CORS
         │
┌────────▼─────────────────────────────────────┐
│     Express.js Backend (Node.js)             │
│     http://localhost:5000                    │
│                                              │
│  Routes:                                     │
│  - POST /api/repair                          │
│  - GET /api/repair                           │
│  - GET /api/repair/:id                       │
│  - PUT /api/repair/:id                       │
│  - DELETE /api/repair/:id                    │
└────────┬─────────────────────────────────────┘
         │
         │ mysql2
         │
┌────────▼─────────────────────────────────────┐
│        MySQL Database                        │
│        servicereq_db                         │
│                                              │
│  Tables:                                     │
│  - repair (เก็บข้อมูลแจ้งซ่อม)                │
│  - users (เก็บข้อมูลผู้ใช้)                   │
└─────────────────────────────────────────────┘
```

---

## 📚 File Structure

```
e:\Project_Final\
├── Server/
│   ├── index.js                          ← Server entry point
│   ├── package.json
│   ├── config/
│   │   ├── database.js                   ← MySQL connection
│   │   └── initialize.js                 ← สร้างตาราง
│   ├── controllers/
│   │   ├── usersController.js
│   │   └── repairController.js           ← จัดการแจ้งซ่อม
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── repair.js                     ← API endpoints
│   ├── midware/
│   │   └── auth.js
│   ├── diagnose.js                       ← ทดสอบ database
│   └── test-repair-api.js                ← ทดสอบ API
│
└── Client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── services/
        │   └── api.js                    ← API client (axios)
        ├── page/
        │   ├── loginPage.jsx
        │   ├── registerPage.jsx
        │   ├── HomePage.jsx
        │   ├── Repair.jsx                ← Form แจ้งซ่อม
        │   └── RepairList.jsx            ← รายการแจ้งซ่อม
        ├── routes/
        │   ├── AppRouter.jsx
        │   ├── AdminRoutes.jsx
        │   ├── UserRoutes.jsx
        │   └── GuestRoutes.jsx
        ├── components/
        │   ├── header.jsx
        │   ├── Footer.jsx
        │   └── Error404.jsx
        └── context/
            └── AuthContext.jsx
```

---

## 🧪 Testing

### ทดสอบ Database
```bash
cd e:\Project_Final\Server
node diagnose.js
```

### ทดสอบ API
```bash
node test-repair-api.js
```

### ทดสอบ Manual (Browser Console)
```javascript
// ตรวจสอบ user data
console.log(localStorage.getItem('user'));

// ทดสอบ API
const response = await fetch('http://localhost:5000/api/repair', {
  method: 'GET'
});
console.log(await response.json());
```

---

## ✅ Deployment Checklist

- [ ] MySQL Database created
- [ ] Server dependencies installed (npm install)
- [ ] Client dependencies installed (npm install)
- [ ] Server running on port 5000
- [ ] Client running on port 5173
- [ ] Repair table created in database
- [ ] Can login and access repair form
- [ ] Can submit repair request
- [ ] Data saves in database
- [ ] Can view repair list

---

## 📞 Support

หากมีปัญหา ให้:
1. ตรวจสอบ Server logs
2. รัน `node diagnose.js`
3. ตรวจสอบ Browser Console (F12)
4. ตรวจสอบ MySQL ว่าตาราง repair มีข้อมูลหรือไม่

---

**เวอร์ชัน:** 1.0.0  
**อัปเดตล่าสุด:** 2024  
**สถานะ:** ✅ Working
