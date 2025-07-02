import winston from "winston";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import LokiTransport from "winston-loki";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.resolve(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
  console.log("[ Logger ] Log directory created:", logDirectory);
}

const colorMap = {
  "Kafka Server": chalk.magenta.bold,
  "Socket.io Server": chalk.cyan.bold,
  "MongoDb Server": chalk.green.bold,
  CLOUDINARY: chalk.blue.bold,
  Server: chalk.yellowBright.bold,
};

const prettyPrint = winston.format.printf((info) => {
  const { level, message, timestamp, server_name, ...extra } = info;
  const colorFn = colorMap[server_name] || ((txt) => txt);

  let extraInfo = Object.keys(extra).length
    ? JSON.stringify(extra, null, 2)
    : "";

  return `${colorFn(
    `[ ${server_name || "Server"} ]`
  )} :: ${timestamp} ${level}: ${message} `;
});

const loggerInstance = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    prettyPrint
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, "server.log"),
      level: "info",
    }),
    new LokiTransport({
      host :`http://127.0.0.1:3100`,
    })
  ],
  exitOnError: false,
});

export const kafkaLogger = loggerInstance.child({
  server_name: "Kafka Server",
});
export const socketioLogger = loggerInstance.child({
  server_name: "Socket.io Server",
});
export const mongodbLogger = loggerInstance.child({
  server_name: "MongoDb Server",
});
export const cloudinaryLogger = loggerInstance.child({
  server_name: "CLOUDINARY",
});
const logger = loggerInstance.child({ server_name: "Server" });
export default logger;
