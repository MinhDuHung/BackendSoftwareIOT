const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http");
const sensorRoutes = require("./routes/sensorRoutes");
const actionRoutes = require("./routes/actionRoutes");
const initializeSocket = require("./socket");
const { connectToBroker } = require("./mqtt");
const server = http.createServer(app);

initializeSocket(server);

connectToBroker();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use("/sensor", sensorRoutes);
app.use("/action", actionRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
