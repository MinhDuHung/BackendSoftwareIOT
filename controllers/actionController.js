const pool = require("../db");
const { publishToBroker } = require("../mqtt");
const DEFAULT_ITEMS_PER_QUERY = 60;

const chunkResults = (results) => {
  const chunkedResults = [];
  for (let j = 0; j < results.length; j += 12) {
    const chunk = results.slice(j, j + 12);
    chunkedResults.push(chunk);
  }
  return chunkedResults;
};

const getAllActions = async (req, res) => {
  try {
    const numberOfQueries = req.query.numberOfQueries || 1;
    const offset = (numberOfQueries - 1) * DEFAULT_ITEMS_PER_QUERY;
    const query = `SELECT * FROM action ORDER BY datetime DESC LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
    const [results] = await pool.query(query);
    const chunkedResults = chunkResults(results);
    res.status(200).json(chunkedResults);
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handleSortingAscDesc = async (req, res) => {
  try {
    const numberOfQueries = req.query.numberOfQueries || 1;
    const type = req.query.type;
    const sortType = req.query.sortType;
    const offset = (numberOfQueries - 1) * DEFAULT_ITEMS_PER_QUERY;
    let orderByClause = "";
    if (type === "datetime") {
      orderByClause = `ORDER BY STR_TO_DATE(datetime, "%d/%m/%Y %H:%i:%s") ${sortType}`;
    } else {
      orderByClause = `ORDER BY ${type} ${sortType}`;
    }
    const query = `SELECT * FROM action ${orderByClause} LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
    const [results] = await pool.query(query);
    const chunkedResults = chunkResults(results);
    res.status(200).json(chunkedResults);
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handleSortingChosenOne = async (req, res) => {
  try {
    const numberOfQueries = req.query.numberOfQueries || 1;
    const type = req.query.type;
    const action = req.query.action;
    const offset = (numberOfQueries - 1) * DEFAULT_ITEMS_PER_QUERY;
    const query = `SELECT * FROM action WHERE ${type} = "${action}" LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
    const [results] = await pool.query(query);
    const chunkedResults = chunkResults(results);
    res.status(200).json(chunkedResults);
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    res.status(500).send("Internal Server Error");
  }
};

const insertAction = async (req, res) => {
  try {
    const { device, mode, datetime } = req.body;
    const data = { [device]: mode };
    publishToBroker(data);
    // const query = 'INSERT INTO action (device, mode, datetime) VALUES (?, ?, ?)';
    // const [result] = await pool.query(query, [device, mode, datetime]);
    res.status(201).json({ message: "Record inserted successfully" });
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handleSearchByCharacters = async (req, res) => {
  try {
    const numberOfQueries = req.query.numberOfQueries || 1;
    const searchKeyword = req.query.keyword;
    const searchKeywordLower = searchKeyword ? searchKeyword.toLowerCase() : "";
    const offset = (numberOfQueries - 1) * DEFAULT_ITEMS_PER_QUERY;
    let query = "";
    if (searchKeyword) {
      if (req.query.field) {
        const field = req.query.field;
        query = `SELECT * FROM action WHERE LOWER(${field}) LIKE '%${searchKeywordLower}%' LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
      } else {
        query = `SELECT * FROM action WHERE LOWER(id) LIKE '%${searchKeywordLower}%' OR LOWER(device) LIKE '%${searchKeywordLower}%' OR LOWER(mode) LIKE '%${searchKeywordLower}%' OR LOWER(datetime) LIKE '%${searchKeywordLower}%' LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
      }
    } else {
      query = `SELECT * FROM action LIMIT ${offset}, ${DEFAULT_ITEMS_PER_QUERY}`;
    }
    const [results] = await pool.query(query);
    const chunkedResults = chunkResults(results);
    res.status(200).json(chunkedResults);
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateDeviceAttributeForAll = async (req, res) => {
  try {
    const query = 'UPDATE action SET mode = IF(mode = 1, "On", "Off")';
    await pool.query(query);
    res.status(200).json({ message: "All device attributes updated successfully" });
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllActions,
  insertAction,
  handleSortingAscDesc,
  handleSortingChosenOne,
  handleSearchByCharacters,
  updateDeviceAttributeForAll,
};
