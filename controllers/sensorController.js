
const pool = require('../db');

const getAllSensors = async (req, res) => {
  try {
    const query = 'SELECT * FROM sensor';
    const [results] = await pool.query(query);
    res.status(200).json(results);
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

module.exports = {
  getAllSensors,
  insertSensor,
};
