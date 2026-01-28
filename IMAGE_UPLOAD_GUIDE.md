# 📸 Image Upload System - คู่มือการใช้งาน

## 🎯 ภาพรวม

ระบบอัพโหลดรูปภาพมีส่วนประกอบดังนี้:

### Backend
1. **Server/uploads/** - โฟลเดอร์เก็บรูปภาพ
2. **Server/controllers/uploadController.js** - จัดการอัพโหลดและลบรูป
3. **Server/routes/upload.js** - Routes สำหรับอัพโหลด
4. **Server/index.js** - Serve static files จาก /uploads

### Frontend
1. **Client/src/services/api.js** - uploadAPI object
2. **Client/src/page/Repair.jsx** - อัพโหลดรูปก่อนส่งแจ้งซ่อม
3. **Client/src/page/Moving.jsx** - อัพโหลดรูปก่อนส่งคำขอย้าย
4. **Client/src/page/Repost.jsx** - แสดงรูปจาก server

---

## 🗂️ โครงสร้างโฟลเดอร์

```
Server/
├── uploads/                          ← โฟลเดอร์เก็บรูป
├── controllers/
│   ├── uploadController.js           ← Upload logic
│   ├── repairController.js
│   └── movingController.js
├── routes/
│   ├── upload.js                     ← Upload routes
│   ├── repair.js
│   └── moving.js
└── index.js                          ← Static file serving
```

---

## 🔌 API Endpoints

### Upload Image (POST)
```
POST /api/upload
Content-Type: application/json

Request Body:
{
  "imageData": "data:image/jpeg;base64,...",
  "fileName": "photo.jpg"
}

Response (200):
{
  "success": true,
  "message": "อัพโหลดรูปภาพสำเร็จ",
  "data": {
    "fileName": "1703421000000-photo.jpg",
    "fileUrl": "/uploads/1703421000000-photo.jpg",
    "filePath": "e:\\Project_Final\\Server\\uploads\\1703421000000-photo.jpg"
  }
}
```

### Delete Image (DELETE)
```
DELETE /api/upload
Content-Type: application/json

Request Body:
{
  "fileName": "1703421000000-photo.jpg"
}

Response (200):
{
  "success": true,
  "message": "ลบรูปภาพสำเร็จ"
}
```

---

## 💻 Client-side Usage

### Import uploadAPI
```javascript
import { uploadAPI } from "../services/api";
```

### Upload Image
```javascript
// 1. Read file as base64
const file = files[0];
const reader = new FileReader();
reader.onload = async (event) => {
  const base64Data = event.target.result;
  
  // 2. Call uploadAPI
  const response = await uploadAPI.uploadImage(base64Data, file.name);
  
  if (response.success) {
    console.log('Image URL:', response.data.fileUrl);
    // ใช้ fileUrl ในการบันทึกลง database
  }
};
reader.readAsDataURL(file);
```

### Delete Image
```javascript
const response = await uploadAPI.deleteImage('1703421000000-photo.jpg');
if (response.success) {
  console.log('Image deleted');
}
```

---

## 📝 Flow ของระบบแจ้งซ่อม

```
User selects images
       ↓
Form submitted
       ↓
Upload images → Get file URLs
       ↓
Save file URLs to database (img column)
       ↓
Success message
```

### Repair.jsx Code Example
```javascript
// Step 1: Upload images
let imagePaths = [];
for (const file of formData.images) {
  const reader = new FileReader();
  const imageBase64 = await new Promise((resolve) => {
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  const uploadResponse = await uploadAPI.uploadImage(imageBase64, file.name);
  if (uploadResponse.success) {
    imagePaths.push(uploadResponse.data.fileUrl);
  }
}

// Step 2: Send to database
const repairData = {
  user_id: userId,
  user_name: userName,
  location: formData.location,
  type_work: formData.jobType,
  detail: formData.details,
  img: imagePaths.join(", "),  // Multiple images separated by comma
};

await repairAPI.createRepair(repairData);
```

---

## 🖼️ Display Images

### In Repost.jsx
```javascript
// Get image URL from database
const image = item.img 
  ? `http://localhost:5000${item.img}` 
  : "https://fallback-image.jpg";

// Display image
<img 
  src={image} 
  alt="repair" 
  onError={(e) => {
    e.target.src = "https://fallback-image.jpg";
  }}
/>
```

---

## 🔒 Security Considerations

### Current Implementation
- ✅ Save with timestamp to prevent overwrite
- ✅ Validate file extension based on name
- ✅ Limit request size to 50MB
- ✅ Validate file before saving

### Recommendations
- [ ] Add file type validation (mime-type check)
- [ ] Add file size limit per image
- [ ] Add authentication check for upload
- [ ] Sanitize file names
- [ ] Add virus scan for uploaded files

---

## 🚀 Production Deployment

### For Production
```javascript
// Change hardcoded localhost
const imageUrl = process.env.REACT_APP_API_URL + item.img;
// or
const imageUrl = `${API_BASE_URL}${item.img}`;
```

### Set Environment Variables
```bash
# .env.production
REACT_APP_API_URL=https://your-domain.com
```

---

## 🧪 Testing

### Manual Test
1. Go to Repair page
2. Select image file
3. Fill form and submit
4. Check `/api/repair` returns file URL in `img` column
5. Go to Repost page
6. Verify image displays correctly

### Server-side Test
```bash
# Check uploads folder
ls -la Server/uploads/

# Should see uploaded images like:
# 1703421000000-photo.jpg
# 1703421234567-image.png
```

### Database Test
```sql
SELECT * FROM repair;
-- img column should contain: /uploads/1703421000000-photo.jpg
```

---

## 📊 Database Schema Update

The `img` column now stores:
- Single image: `/uploads/filename.jpg`
- Multiple images: `/uploads/file1.jpg, /uploads/file2.jpg`

---

## ⚠️ Troubleshooting

### Images not uploading
1. Check server console for errors
2. Verify uploads folder exists
3. Check file size < 50MB
4. Check browser console for errors

### Images not displaying
1. Check image URL format
2. Verify file exists in Server/uploads/
3. Check CORS is enabled
4. Try fallback image

### File not found on server
1. Check Server/uploads/ folder path
2. Verify static file serving enabled
3. Check permissions on uploads folder

---

## 📌 File Storage Path

All uploaded images are saved to:
```
e:\Project_Final\Server\uploads\
```

Access via browser:
```
http://localhost:5000/uploads/filename.jpg
```

---

**สรุป:** ระบบอัพโหลดรูปมีความสมบูรณ์และใช้งานได้แล้ว! ✅
