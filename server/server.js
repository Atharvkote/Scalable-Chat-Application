// Server Enivronment
import "dotenv/config";

// Dependencies
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { fileURLToPath } from "url";
import Redis from "ioredis";

// Connections & Configurations
import { connectDB, disconnectDB } from "./src/configs/mongodb.config.js";
import logger from "./src/utils/logger.js";

// Routers
import authRouter from "./src/routes/auth.route.js";

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


!redisClient ? logger.error(`Redis client connection failed on ${process.env.REDIS_URL} , [ Enviroment : Docker ]`) : logger.info(`Redis client connected successfully on ${process.env.REDIS_URL} , [ Enviroment : Docker ]`);

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Rate Limiters
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 100, // 100 requests
  duration: 30, // 10 requests
  blockDuration: 15, // Block for 15 min if limit is exceeded
});

const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "auth_fail_limiter",
  points: 10, // 10 requests
  duration: 60 * 15, // Per 15 minutes
  blockDuration: 60 * 15, // Block for 15 min if limit is exceeded
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

app.use("/api/v1/auth", async (req, res, next) => {
  try {
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

// Routes Middleware
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body : \n ${JSON.stringify(req.body, null, 2)}`);
  logger.info(`Request IP, ${req.ip}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
app.use("/api/v1/auth", authRouter);

// Start server
server.listen(SERVER_PORT, () => {
  logger.info(
    `Server is running on http://localhost:${SERVER_PORT} [ Enviroment : ${process.env.NODE_ENV}]`
  );
});

// Graceful Shutdown
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
