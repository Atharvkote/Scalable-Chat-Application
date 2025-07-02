import { producer, consumer } from "../configs/kafka.config.js";
import MessageModel from "../models/message.model.js";
import { kafkaLogger } from "../utils/logger.js";

/**
 * @function sendToKafka
 * @description Sends a JSON stringified message to a specified Kafka topic.
 *
 * @param {string} topic - Kafka topic name
 * @param {Object} message - Message payload to send
 *
 * @returns {void}
 */

export const sendToKafka = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    kafkaLogger.info(`Message sent to Kafka topic: ${topic}`);
  } catch (err) {
    kafkaLogger.error({
      message: `Error sending message to Kafka topic ${topic}`,
      error: err.stack || err,
    });
  }
};

/**
 * @function kafkaToMongoDB
 * @description Subscribes to a Kafka topic, listens for messages,
 * parses them, and saves them into MongoDB using MessageModel.
 *
 * @param {string} topic - Kafka topic to subscribe to
 *
 * @returns {void}
 */

export const kafkaToMongoDB = async (topic) => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          const newMessage = new MessageModel(data);
          const savedMessage = await newMessage.save();

          if (savedMessage) {
            kafkaLogger.info(
              "Message received from Kafka and saved to the database."
            );
          } else {
            kafkaLogger.error("Failed to save message to the database.");
          }
        } catch (err) {
          kafkaLogger.error("Error processing Kafka message:", err);
        }
      },
    });

    kafkaLogger.info(`Kafka consumer subscribed to topic: ${topic}`);
  } catch (err) {
    kafkaLogger.error("Error initializing Kafka consumer:", err);
  }
};
