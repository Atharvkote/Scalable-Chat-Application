import { producer, consumer } from "../configs/kafka.config.js";
import MessageModel from "../models/message.model.js";
import logger from "../utils/logger.js";

export const sendToKafka = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    logger.info(`Message sent to Kafka topic: ${topic}`);
  } catch (err) {
    logger.error(`Error sending message to Kafka topic ${topic}:`, err);
  }
};

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
            logger.info(
              "Message received from Kafka and saved to the database."
            );
          } else {
            logger.error("Failed to save message to the database.");
          }
        } catch (err) {
          logger.error("Error processing Kafka message:", err);
        }
      },
    });

    logger.info(`Kafka consumer subscribed to topic: ${topic}`);
  } catch (err) {
    logger.error("Error initializing Kafka consumer:", err);
  }
};
