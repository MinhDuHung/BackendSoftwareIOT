const pool = require('../db');

const DEFAULT_ITEMS_PER_QUERY = 60;

const chunkResults = (results) => {
  const chunkedResults = [];
  for (let j = 0; j < results.length; j += 12) {
    const chunk = results.slice(j, j + 12);
    chunkedResults.push(chunk);
  }
  return chunkedResults;
};

const getAllSensors = async (req, res) => {
  try {
    const numberOfQueries = req.query.numberOfQueries || 1;
    const offset = (numberOfQueries - 1) * DEFAULT_ITEMS_PER_QUERY;
    const query = `SELECT * FROM sensor LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
    const [results] = await pool.query(query);
    const chunkedResults = chunkResults(results);
    res.status(200).json(chunkedResults);
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
    const numberOfQueries = req.query.numberOfQueries || 1;
    const type = req.query.type;
    const sortType = req.query.sortType;
    const offset = (numberOfQueries - 1) * DEFAULT_ITEMS_PER_QUERY;
    let orderByClause = '';
    if (type === 'datetime') {
      orderByClause = `ORDER BY STR_TO_DATE(datetime, "%d/%m/%Y %H:%i:%s") ${sortType}`;
    } else {
      orderByClause = `ORDER BY ${type} ${sortType}`;
    }
    const query = `SELECT * FROM sensor ${orderByClause} LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
    const [results] = await pool.query(query);
    const chunkedResults = chunkResults(results);
    res.status(200).json(chunkedResults);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).send('Internal Server Error');
  }
};

const handleSearchByCharacters = async (req, res) => {
  try {
    const numberOfQueries = req.query.numberOfQueries || 1;
    const searchKeyword = req.query.keyword;
    const searchKeywordLower = searchKeyword ? searchKeyword.toLowerCase() : '';
    const offset = (numberOfQueries - 1) * DEFAULT_ITEMS_PER_QUERY;
    let query = '';
    if (searchKeyword) {
      if (req.query.field) {
        const field = req.query.field;
        query = `SELECT * FROM sensor WHERE LOWER(${field}) LIKE '%${searchKeywordLower}%' LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
      } else {
        query = `SELECT * FROM sensor WHERE LOWER(id) LIKE '%${searchKeywordLower}%' OR LOWER(temperature) LIKE '%${searchKeywordLower}%' OR LOWER(humidity) LIKE '%${searchKeywordLower}%' OR LOWER(brightness) LIKE '%${searchKeywordLower}%' OR LOWER(datetime) LIKE '%${searchKeywordLower}%' LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
      }
    } else {
      query = `SELECT * FROM sensor LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
    }
    const [results] = await pool.query(query);
    const chunkedResults = chunkResults(results);
    res.status(200).json(chunkedResults);
  } catch (error) {
    console.error('Error executing MySQL query:', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = {
  getAllSensors,
  insertSensor,
  handleSortingAscDesc,
  handleSearchByCharacters
};
