const { Server } = require("socket.io");
const { getLastestSensorData } = require("./controllers/sensorController");

module.exports = function initializeSocket(server) {
  const io = new Server(3003, server);
  io.on("connection", async (socket) => {
    const interval = 5000;

    setInterval(async () => {
      const res = await getLastestSensorData();
      socket.emit("send_sensor_data", res[0]);
    }, interval);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  return io;
};
