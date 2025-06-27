import "dotenv/config";
import { Kafka, logLevel } from "kafkajs";
import logger from "../utils/logger.js";

const kafka = new Kafka({
  brokers: ["192.168.0.100:9093"],
  ssl: false,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  logLevel: logLevel.ERROR,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chat-messages" });

export const connectToKafka = async () => {
  await producer.connect();
  logger.info("Setting Up Connections with Kafka Server Running on http://localhost:9093 [ Enviroment : Docker ]");
};
