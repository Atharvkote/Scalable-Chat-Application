import "dotenv/config";
import { Kafka, logLevel } from "kafkajs";
import { kafkaLogger } from "../utils/logger.js";

/**
 * @file Kafka configuration
 * @description Sets up Kafka producer & consumer using kafkajs with custom logging.
 *
 * Exports:
 * - producer: Kafka producer instance
 * - consumer: Kafka consumer (group: chat-messages)
 * - connectToKafka(): connects producer and logs status
 *
 * Env vars:
 * - KAFKA_USERNAME
 * - KAFKA_PASSWORD
 */

const kafka = new Kafka({
  brokers: ["192.168.0.100:9093"],
  ssl: false,
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  logLevel: logLevel.ERROR,
  logCreator:
    (level) =>
    ({ namespace, label, log }) => {
      const { message, ...extra } = log;
      const server_name = "KAFKA";
      if (level === logLevel.ERROR) {
        kafkaLogger.error(` [ ${namespace} ] ${message}`, extra, server_name);
      } else if (level === logLevel.WARN) {
        kafkaLogger.warn(`[ ${namespace} ] ${message}`, extra, server_name);
      } else if (level === logLevel.INFO) {
        kafkaLogger.info(`[ ${namespace} ] ${message}`, extra, server_name);
      } else {
        kafkaLogger.debug(`[ ${namespace} ] ${message}`, extra, server_name);
      }
    },
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chat-messages" });

export const connectToKafka = async () => {
  await producer.connect();
  kafkaLogger.info(
    "Setting Up Connections with Kafka Server Running on http://localhost:9093 [ Enviroment : Docker ]"
  );
};
