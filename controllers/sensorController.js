
const pool = require('../db');

const getAllSensors = async (req, res) => {
  try {
    const numberOfQueries = req.query.number || 1; // Số lần truy vấn mặc định là 1 nếu không có tham số
    const itemsPerQuery = 60;
    let allResults = [];

    const offset = (numberOfQueries - 1) * itemsPerQuery;
    const query = `SELECT * FROM sensor LIMIT ${offset}, ${itemsPerQuery}`;
    const [results] = await pool.query(query);

    // Chia nhỏ mảng thành các mảng con với kích thước 12 bản ghi mỗi mảng
    const chunkedResults = [];
    for (let j = 0; j < results.length; j += 12) {
      const chunk = results.slice(j, j + 12);
      chunkedResults.push(chunk);
    }

    allResults = allResults.concat(chunkedResults); // Sử dụng concat để chèn kết quả mới vào đầu mảng

    res.status(200).json(allResults);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).send('Internal Server Error');
  }
};


const insertSensor = async (req, res) => {
  try {
    const { temperature, humidity, brightness, datetime } = req.body;
    const query = 'INSERT INTO sensor (temperature, humidity, brightness, datetime) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [temperature, humidity, brightness, datetime]);
    res.status(201).json({ id: result.insertId, message: 'Record inserted successfully' });
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).send('Internal Server Error');
  }
};

const handleSortingAscDesc = async (req, res) => {
  try {
    const numberOfQueries = req.query.number || 1;
    const type = req.query.type;
    const sortType = req.query.sortType;

    console.log(type, sortType)
    const itemsPerQuery = 60;
    let allResults = [];
    const offset = (numberOfQueries - 1) * itemsPerQuery;
    let orderByClause = '';

    // Xây dựng phần ORDER BY cho câu truy vấn dựa trên thuộc tính và kiểu sắp xếp
    if (type === 'datetime') {
      orderByClause = `ORDER BY STR_TO_DATE(datetime, "%d/%m/%Y %H:%i:%s") ${sortType}`;
    } else {
      orderByClause = `ORDER BY ${type} ${sortType}`;
    }

    const query = `SELECT * FROM sensor ${orderByClause} LIMIT ${offset}, ${itemsPerQuery}`;
    const [results] = await pool.query(query);
    const chunkedResults = [];
    for (let j = 0; j < results.length; j += 12) {
      const chunk = results.slice(j, j + 12);
      chunkedResults.push(chunk);
    }

    allResults = allResults.concat(chunkedResults);

    res.status(200).json(allResults);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  getAllSensors,
  insertSensor,
  handleSortingAscDesc
};
