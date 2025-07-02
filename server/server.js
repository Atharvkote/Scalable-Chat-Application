/**
 * @file server.js
 * @description Main server entry point.
 * Initializes Express application, sets up middleware, connects to MongoDB, Redis, Kafka,
 * and configures Socket.IO for real-time communication. Also handles graceful shutdown.
 *
 * Key features:
 * - Express with security (helmet, cors), rate limiting (rate-limiter-flexible + rate-limit-redis)
 * - MongoDB connection via Mongoose
 * - Redis for rate limiting and Socket.IO scaling
 * - Kafka producer & consumer integration
 * - Socket.IO server with Redis streams adapter for horizontal scaling
 * - Routes for auth and messaging APIs
 * - Graceful shutdown on SIGINT / SIGTERM
 *
 * @usage
 * Start with `npm run dev` or `npx nodemon server.js` (after environment variables are configured).
 */

// Server Enivronment
import "dotenv/config";

// Dependencies
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import helmet from "helmet";
import Redis from "ioredis";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";

// Connections & Configurations
import { connectDB, disconnectDB } from "./src/configs/mongodb.config.js";
import logger from "./src/utils/logger.js";
import { kafkaLogger, socketioLogger } from "./src/utils/logger.js";

// Routers
import authRouter from "./src/routes/auth.route.js";
import messageRouter from "./src/routes/messages.route.js";

// Web Socket Broadcasters
import { socketIOBroadcastor } from "./src/configs/socket.config.js";
import { connectToKafka } from "./src/configs/kafka.config.js";
import { kafkaToMongoDB } from "./src/controllers/kafka.controller.js";

// Configs
await connectDB();

// Definitions
const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const server = http.createServer(app);
const redisClient = new Redis(process.env.REDIS_URL);
const allowedOrigins = ["http://localhost:5173"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

!redisClient
  ? logger.error(
      `Redis client connection failed on ${process.env.REDIS_URL} , [ Enviroment : Docker ]`
    )
  : logger.info(
      `Redis client connected successfully on ${process.env.REDIS_URL} , [ Enviroment : Docker ]`
    );

/**
 * @middleware Parsing & Security
 *
 * - express.json() + bodyParser.json(): Parses JSON request bodies.
 * - express.urlencoded(): Parses URL-encoded form data (supports extended syntax).
 * - cookieParser(): Reads cookies from incoming requests.
 * - helmet(): Secures HTTP headers and enables cross-origin resource policy.
 */
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/**
 * @middleware CORS
 * Configures Cross-Origin Resource Sharing for the API.
 *
 * - Allows requests only from whitelisted origins (defined in `allowedOrigins`).
 * - Supports credentials (cookies, auth headers) for cross-origin requests.
 * - Restricts allowed HTTP methods to GET, POST, PUT, PATCH, DELETE, OPTIONS.
 *
 * Rejects any origin not explicitly listed, returning a CORS error.
 */

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

/**
 * @socketio Initialization & Broadcasting
 *
 * - Creates Socket.IO server instance attached to HTTP server with Redis adapter
 *   for pub/sub scaling across multiple server instances.
 * - Configures CORS to only allow requests from specified origins with selected HTTP methods.
 * - Sets heartbeat options with `pingInterval` and `pingTimeout` to keep connections alive.
 * - `allowEIO3` ensures backward compatibility with older Socket.IO v3 clients.
 *
 * After initialization:
 * - Logs whether Socket.IO was successfully started.
 * - Calls `socketIOBroadcastor()` to begin broadcasting user connections and
 *   handling incoming socket events (defined in socket.config.js).
 */

const io = new Server(server, {
  adapter: createAdapter(redisClient),
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PATCH", "HEAD", "PUT"],
    credentials: true,
  },
  pingInterval: 5000,
  pingTimeout: 20000,
  allowEIO3: true,
});

io
  ? socketioLogger.info(
      `Web Socket(Socket.io) Server Initialized! [ Enviroment : ${process.env.NODE_ENV}]`
    )
  : socketioLogger.error(
      `Web Socket(Socket.io) Server Initialization Failed! [ Enviroment : ${process.env.NODE_ENV}]`
    );
export default io;

// Broadcast Joined Users
socketIOBroadcastor();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

/**
 * @ratelimiter Global Rate Limiter
 * Uses `RateLimiterRedis` to apply a general rate limit of:
 * - 100 requests per IP within 30 seconds
 * - If exceeded, blocks IP for 15 minutes.
 *
 * Protects the API from excessive requests across all routes.
 */

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 100, // 100 requests
  duration: 30, // 10 requests
  blockDuration: 15, // Block for 15 min if limit is exceeded
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    });
});

/**
 * @ratelimiter Auth Rate Limiter
 * Intended to protect sensitive auth routes (login/signup) by limiting to:
 * - 10 requests per 15 minutes
 * - If exceeded, blocks IP for another 15 minutes.
 *
 */

const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "auth_fail_limiter",
  points: 10, // 10 requests
  duration: 60 * 15, // Per 15 minutes
  blockDuration: 60 * 15, // Block for 15 min if limit is exceeded
});

app.use("/api/v1/auth", async (req, res, next) => {
  try {
    if (req.path === "/check-auth") {
      return next();
    }
    await authLimiter
      .consume(req.ip)
      .then(() => next())
      .catch(() => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ success: false, message: "Too many requests" });
      });
  } catch (rejRes) {
    res.status(429).json({
      message:
        "Too many login/signup attempts. Please try again after 15 minutes.",
    });
  }
});

/**
 * @ratelimiter Sensitive Endpoint Limiter
 * Uses express-rate-limit with RedisStore to specifically throttle high-risk endpoints
 * to max 10 requests per 30 seconds. Designed for future application on endpoints
 * like password reset or account deletion.
 */

const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
    skipFailedRequests: true,
  }),
});

/**
 * @logger Request Logging
 * Logs each incoming request's method, URL, body, and IP address
 * using Winston logger for structured analysis and debugging.
 */

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(
    `Request body : ${req.body ? JSON.stringify(req.body, null, 2) : "N/A"}`
  );
  logger.info(`Request IP, ${req.ip}`);
  next();
});

/**
 * @router Routes
 *
 * - GET `/` : Root endpoint to verify server is running, returns a simple welcome message.
 *
 * - Mounts `/api/v1/auth` to handle authentication-related operations
 *   (login, signup, profile, etc) via `authRouter`.
 *
 * - Mounts `/api/messages` to handle chat messaging routes via `messageRouter`,
 *   including sending messages, fetching conversations, and listing online users.
 */

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/messages", messageRouter);

/**
 * @kafkaserver Kafka Setup
 *
 * - connectToKafka(): Establishes connection to Kafka broker for producing messages.
 *   Used to send chat messages to the configured Kafka topic.
 *
 * - kafkaToMongoDB(): Connects a Kafka consumer that listens to the same topic,
 *   receives messages, and persists them into MongoDB for long-term storage.
 *
 * Both are wrapped with `.catch()` to log any initialization errors using `kafkaLogger`.
 */

connectToKafka().catch((error) => {
  kafkaLogger.error("Error in Connecting to Kafka Server :", error);
});

kafkaToMongoDB(process.env.KAFKA_TOPIC).catch((error) => {
  kafkaLogger.error("Error in Consuming form Kafka Server :", error);
});

/**
 * @mainserver Server Startup & Graceful Shutdown
 *
 * - Starts HTTP server on configured `SERVER_PORT`, logging environment details for clarity.
 *
 * - Sets up graceful shutdown hooks on `SIGINT` (Ctrl+C) and `SIGTERM` (container stop),
 *   ensuring:
 *     - HTTP server closes first
 *     - Active MongoDB connections are disconnected via `disconnectDB()`
 *     - Process exits cleanly
 *
 * - Includes a hard timeout to force exit after 10 seconds if cleanup stalls.
 */

server.listen(SERVER_PORT, () => {
  logger.info(
    `Server is running on http://localhost:${SERVER_PORT} [ Enviroment : ${process.env.NODE_ENV}]`
  );
});

const shutdown = async () => {
  logger.info(
    `Server shutting down on http://localhost:${SERVER_PORT} [ Enviroment : ${process.env.NODE_ENV}]`
  );
  server.close(async () => {
    console.log("HTTP server closed.");
    await disconnectDB();
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forcing shutdown...");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

