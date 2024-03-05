// routes/sensorRoutes.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Route để lấy toàn bộ dữ liệu từ bảng sensor
router.get('/getAllSensors', sensorController.getAllSensors);
router.post('/insertSensor', sensorController.insertSensor);
module.exports = router;
