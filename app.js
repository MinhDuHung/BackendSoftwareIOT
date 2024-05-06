// app.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sensorRoutes = require('./routes/sensorRoutes');
const actionRoutes = require('./routes/actionRoutes');
// Sử dụng body-parser middleware để xử lý dữ liệu đầu vào từ phía client
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sử dụng routes
app.use('/sensor', sensorRoutes);
app.use('/action', actionRoutes);
// Cấu hình server...


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
