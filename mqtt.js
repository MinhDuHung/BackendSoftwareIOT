const mqtt = require("mqtt");
const { insertSensor } = require("./controllers/sensorController");

const mqtt_server = "mqtt://192.168.1.7";
const mqtt_port = 2024;
const mqtt_username = "Uy";
const mqtt_password = "123";
const sensor_topic = "sensor";
const action_topic = "device_controller";

const client = mqtt.connect(mqtt_server, {
  port: mqtt_port,
  clientId: `client${Math.random().toString(36).substring(7)}`,
  username: mqtt_username,
  password: mqtt_password,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
});

function connectToBroker() {
  client.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  client.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  client.on("connect", function () {
    console.log("Connected to MQTT broker");
    client.subscribe(sensor_topic);
  });

  client.on("message", function (_topic, message) {
    if (_topic === sensor_topic) {
      const data = JSON.parse(message);
      insertSensor(data);
    }
  });
  return client;
}

function publishToBroker(data) {
  console.log(`Publishing to Topic: ${action_topic}`);
  client.publish(action_topic, JSON.stringify(data), { qos: 0 });
}

module.exports = {
  connectToBroker,
  publishToBroker,
};
