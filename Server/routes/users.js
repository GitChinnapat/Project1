// routes/users.js
const express = require('express');
const router = express.Router();

// นำเข้า controller ที่เกี่ยวข้อง
const usersController = require('../controllers/usersController');

// กำหนดเส้นทาง (route) และเรียกใช้ฟังก์ชันใน controller
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
