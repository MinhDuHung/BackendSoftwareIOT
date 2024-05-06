// routes/sensorRoutes.js
const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

// Route để lấy toàn bộ dữ liệu từ bảng sensor
router.get('/getAllActions', actionController.getAllActions);
router.post('/insertAction', actionController.insertAction);
router.get('/handleSortingAscDesc', actionController.handleSortingAscDesc);
router.get('/handleSortingChosenOne', actionController.handleSortingChosenOne);
router.get('/handleSearchByCharacters', actionController.handleSearchByCharacters);
router.get('/updateDeviceAttributeForAll', actionController.updateDeviceAttributeForAll);
module.exports = router;
