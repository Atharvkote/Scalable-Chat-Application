import winston from 'winston'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

/**
 * @file logger.js
 * @description Centralized logging utility using Winston. This logger is configured to:
 * - Output logs to both the console and a rotating file in the `logs/` directory
 * - Format logs with timestamps, color-coded levels, and a consistent prefix
 * - Automatically create the logs directory if it does not exist
 *
 * This utility helps track server events, warnings, and errors in a consistent format
 * for both development and production environments.
 *
 * @setup
 * - Uses CommonJS-compatible workaround for `__dirname` in ES modules
 * - Logs are saved to: `/logs/server.log`
 * 
 * @loggerLevels
 * - info: General informational messages (e.g. startup, requests)
 * - warn: Non-critical issues or suspicious behavior
 * - error: Failures or unexpected conditions
 *
 * @usage
 * import logger from './utils/logger.js';
 * logger.info('Server started on port 5000');
 * logger.warn('Token missing in request header');
 * logger.error('Database connection failed');
 */


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.resolve(__dirname, '../logs'); 


if (!fs.existsSync(logDirectory)) {
  try {
    fs.mkdirSync(logDirectory, { recursive: true }); 
    console.log('Log directory created');
  } catch (err) {
    console.error('Failed to create log directory:', err);
  }
}

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.colorize(), 
    winston.format.timestamp(), 
    winston.format.printf(({  timestamp, level, message }) => {
      return `[ Server ] :: ${timestamp} ${level}: ${message}`; 
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, 'server.log') 
    }) 
  ],
});

export default logger;