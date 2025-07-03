# Scalable Chat Application

This project is a **scalable real-time chat application** designed with modern web technologies.
It supports secure user authentication, live messaging, and robust data pipelines for handling large-scale usage.


![Image](/client/public/Home.png)

## Architecture

This architecture uses multiple Node.js servers to handle WebSocket connections, with Redis Pub/Sub ensuring real-time events are synchronized across all instances. Messages are published to Kafka for scalable, durable processing, then consumed by workers that store them in MongoDB. This design separates concerns—real-time communication, message streaming, and data persistence—making the system highly scalable and fault-tolerant.

```mermaid
flowchart LR
    subgraph Clients
        U1[Client 1]
        U2[Client 2]
        U3[Client 3]
    end

    subgraph Chat Servers
        A[Node.js Instance 1]
        B[Node.js Instance 2]
        C[Node.js Instance 3]
    end

    subgraph Infra
       R["Redis Pub/Sub"]
DB["MongoDB / Any DB"]
W["Kafka Consumer / Worker"]

    end

    subgraph Workers
        W[Kafka Consumer / Worker]
    end

    %% Clients connect via WebSockets
    U1 -- WebSocket --> A
    U2 -- WebSocket --> B
    U3 -- WebSocket --> C

    %% Redis adapter keeps socket instances in sync
    A -- Pub/Sub --> R
    B -- Pub/Sub --> R
    C -- Pub/Sub --> R

    %% Kafka handles message queueing
    A -- Produce --> K
    B -- Produce --> K
    C -- Produce --> K

    %% Worker consumes from Kafka and persists
    K -- Consume --> W
    W -- Store --> DB

    %% Chat servers can also read latest from DB if needed
    A -- Query --> DB
    B -- Query --> DB
    C -- Query --> DB

```

##  Tech Stack Overview

| Technology                                                                                     | Description                          | Role in Project                                                                       |
| ---------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| <div align="center">![React](https://skillicons.dev/icons?i=react)<br>React</div>              | Frontend library for building UIs    | Builds the user interface and handles client-side routing & rendering                 |
| <div align="center">![Vite](https://skillicons.dev/icons?i=vite)<br>Vite</div>                 | Frontend build tool                  | Extremely fast dev server & bundler for React                                         |
| <div align="center">![Tailwind](https://skillicons.dev/icons?i=tailwind)<br>Tailwind CSS</div> | Utility-first CSS framework          | Styles the app responsively and cleanly, with DaisyUI components                      |
| <div align="center">![JavaScript](https://skillicons.dev/icons?i=js)<br>JavaScript</div>       | Programming language                 | Core language used across frontend (React) and backend (Node.js)                      |
| <div align="center">![Node.js](https://skillicons.dev/icons?i=nodejs)<br>Node.js</div>         | JavaScript runtime                   | Runs the Express backend server for APIs and Socket.io                                |
| <div align="center">![Express](https://skillicons.dev/icons?i=express)<br>Express</div>        | Node.js web framework                | Handles HTTP requests, user auth, routing, and initializes Socket.io                  |
| <div align="center"><br>Socket.io</div>                                                      | Real-time WebSocket library          | Enables bi-directional communication for live chat, uses Redis adapter to scale       |
| <div align="center">![MongoDB](https://skillicons.dev/icons?i=mongodb)<br>MongoDB</div>        | NoSQL database                       | Stores users, chat history, and other app data                                        |
| <div align="center">![Kafka](https://skillicons.dev/icons?i=kafka)<br>Kafka</div>              | Distributed event streaming platform | Handles message brokering; ensures messages are decoupled & can be processed reliably |
| <div align="center">![Redis](https://skillicons.dev/icons?i=redis)<br>Redis</div>              | In-memory data store                 | Enables Socket.io pub/sub for scaling across servers                                  |
| <div align="center">![Docker](https://skillicons.dev/icons?i=docker)<br>Docker</div>           | Container platform                   | Runs Kafka, Zookeeper, and Redis services for consistent local dev & deployment       |
| <div align="center">![pnpm](https://skillicons.dev/icons?i=pnpm)<br>pnpm</div>                 | Fast JS package manager              | Installs project dependencies quickly and efficiently                                 |
| <div align="center">![Postman](https://skillicons.dev/icons?i=postman)<br>Postman</div>        | API testing tool                     | Tests REST APIs during development                                                    |
| <div align="center">![Git](https://skillicons.dev/icons?i=git)<br>Git</div>                    | Version control                      | Tracks code changes in the project                                                    |
| <div align="center">![GitHub](https://skillicons.dev/icons?i=github)<br>GitHub</div>           | Code hosting platform                | Hosts repository for collaboration, CI/CD, and backups                                |

## DevOps & Observability Stack

(Yet to be added...)

| Technology                                                                                         | Description                 | Role in Project                                                              |
| -------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| <div align="center">![Jenkins](https://skillicons.dev/icons?i=jenkins)<br>Jenkins</div>            | Automation server           | CI/CD pipeline to build, test, and deploy the application                    |
| <div align="center">![Docker](https://skillicons.dev/icons?i=docker)<br>Docker</div> | Image registry              | Stores built container images for consistent deployments
| <div align="center">![Prometheus](https://skillicons.dev/icons?i=prometheus)<br>Prometheus</div> | Metrics monitoring system | Collects and stores time-series data, powering Grafana dashboards for system metrics |
| <div align="center">![Grafana](https://skillicons.dev/icons?i=grafana)<br>Grafana</div>            | Visualization tool          | Dashboards for monitoring metrics & logs                                     |
| <div align="center">![Sentry](https://skillicons.dev/icons?i=sentry)<br>Sentry</div>               | Error tracking & monitoring | Captures exceptions, frontend & backend errors, with alerts and stack traces |
| <div align="center"><br>Trivy</div>                                                             | Security scanner            | Scans Docker images for vulnerabilities before pushing to prod               |

## Express Routers

This folder contains the route definitions for the authentication and messaging modules of the application. Each router modularizes related endpoints and applies the necessary middleware.

### `auth.route.js` (mounted at `/api/auth`)

Handles user authentication and profile management.

| Method | Route             | Description                                              |
| ------ | ----------------- | -------------------------------------------------------- |
| POST   | `/login`          | Logs in a user and returns a JWT token                   |
| POST   | `/signup`         | Registers a new user with validated input                |
| POST   | `/logout`         | Logs out the user, clears auth token cookie              |
| POST   | `/update-profile` | Updates user profile data *(protected)*                  |
| GET    | `/get-user`       | Fetches currently logged-in user's profile *(protected)* |
| GET    | `/check-auth`     | Checks if the user is authenticated *(protected)*        |

### `message.route.js` (mounted at `/api/messages`)

Manages messaging functionality between users.

| Method | Route       | Description                                                                 |
| ------ | ----------- | --------------------------------------------------------------------------- |
| GET    | `/users`    | Retrieves list of online users excluding the current user *(protected)*     |
| GET    | `/:id`      | Fetches all messages between the authenticated user and `:id` *(protected)* |
| POST   | `/send/:id` | Sends a message from authenticated user to user with `:id` *(protected)*    |

> [!NOTE] Protected routes use `authMiddleware` to ensure the user is logged in.


# Scaling

## Why scale?

As your chat app grows, handling many concurrent users becomes critical.
A single Node.js process can’t manage all connections efficiently.
We use distributed patterns to handle **millions of messages & connections**.

## Strategies used here

### 1. Socket.IO with Redis Adapter

When you run multiple instances of your server (e.g. behind Nginx or a Kubernetes Service), each Node.js process handles its own Socket.IO connections.
**Problem:** They don’t know about sockets connected to other processes.
**Solution:** Use the [socket.io-redis](https://socket.io/docs/v4/scaling-using-redis/) adapter to broadcast events across instances.

#### Example usage

```javascript
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const httpServer = createServer();
const io = new Server(httpServer);

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
});

httpServer.listen(3000);
```

### 2. Kafka for message scaling

Use Kafka to decouple message delivery. Producers write messages to a topic.
Consumers (chat servers or workers) consume from it and process/store.

This handles **massive scale**, provides **message durability**, and decouples chat services from storage.

#### Example producer snippet

```javascript
import { Kafka } from "kafkajs";

const kafka = new Kafka({ brokers: ["localhost:9092"] });
const producer = kafka.producer();

await producer.connect();
await producer.send({
  topic: "chat-messages",
  messages: [{ key: "user1", value: "Hello there!" }],
});
```


## Installation

```bash
> git clone https://github.com/Atharvkote/Scalable-Chat-Application.git
> cd Scalable-Chat-Application
> npm install
> npm install --prefix client && npm install --prefix server
```

### Running the Server

```bash
> npm run dev  # Start of Both the Servers
                       [OR]
> npm run client # Start Client Server
> npm run server # Start Backend Server
```

### Client `.env`

```js
VITE_API_URL = http://localhost:5000/api
```

### Server `.env`

```js
NODE_ENV = development | production
SERVER_PORT = 5000
MONGODB_URI = <YOUR_MONGOURI>
SALT_ROUNDS = 10
JWT_SECRET = <your_jwt_secret_key>
JWT_EXPIRATION = 7d
REDIS_URL = <YOUR_REDIS_SERVER_URL>
REDIS_PORT = 6379
CLOUNDINARY_CLOUD_NAME = <CLOUND_NAME>
CLOUNDINARY_API_KEY = <YOUR_API_KEY>
CLOUNDINARY_API_SECRET = <YOUR_SECRET>
KAFKA_USERNAME = admin
KAFKA_PASSWORD = admin-secret
KAFKA_TOPIC = <TOPIC_NAME>
USER_IP = <YOUR_IP>
```

## Resources

* 📖 [Socket.IO Scaling using Redis Adapter](https://socket.io/docs/v4/scaling-using-redis/)
* 📖 [KafkaJS Documentation](https://kafka.js.org/docs/getting-started)
* 📖 [Docker Docs: Build and run images](https://docs.docker.com/get-started/)
* 📖 [Redis Docs](https://redis.io/docs/)
* 📖 [Kubernetes Docs](https://kubernetes.io/docs/home/)
