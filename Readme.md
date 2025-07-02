# Scalable Chat Application

This project is a **scalable real-time chat application** designed with modern web technologies.
It supports secure user authentication, live messaging, and robust data pipelines for handling large-scale usage.

### Key highlights

* **Frontend** built with React (Vite) and styled using Tailwind CSS + DaisyUI for fast, responsive UIs.
* **Backend** built on Node.js with Express, handling REST APIs, authentication, and real-time WebSocket connections via Socket.io.
* **Socket.io** manages live message delivery to clients.
* **Redis** serves as a pub/sub mechanism for Socket.io to synchronize messages across multiple backend instances, enabling horizontal scaling.
* **Kafka** acts as a message broker, decoupling real-time delivery from database persistence. This ensures reliability and opens paths for future analytics or event-driven microservices.
* **MongoDB** stores persistent user data and chat history.
* **Docker** is used to containerize supporting infrastructure like Kafka, Zookeeper, and Redis, making local development and deployment easy.

## Tech Stack
Absolutely! Here’s a neat **Markdown table** using your skill icons from [skillicons.dev](https://skillicons.dev) with:

✅ **Name + Icon**
✅ **Description of what it is**
✅ **Role in your project**

---

## 🚀 Tech Stack Overview

| Technology | Description | Role in Project |
|------------|-------------|-----------------|
| <div align="center">![React](https://skillicons.dev/icons?i=react)<br>React</div> | Frontend library for building UIs | Builds the user interface and handles client-side routing & rendering |
| <div align="center">![Tailwind](https://skillicons.dev/icons?i=tailwind)<br>Tailwind CSS</div> | Utility-first CSS framework | Styles the app responsively and cleanly, with DaisyUI components |
| <div align="center">![JavaScript](https://skillicons.dev/icons?i=js)<br>JavaScript</div> | Programming language | Core language used across frontend (React) and backend (Node.js) |
| <div align="center">![Node.js](https://skillicons.dev/icons?i=nodejs)<br>Node.js</div> | JavaScript runtime | Runs the Express backend server for APIs and Socket.io |
| <div align="center">![Express](https://skillicons.dev/icons?i=express)<br>Express</div> | Node.js web framework | Handles HTTP requests, user auth, routing, and initializes Socket.io |
| <div align="center">![MongoDB](https://skillicons.dev/icons?i=mongodb)<br>MongoDB</div> | NoSQL database | Stores users, chat history, and other app data |
| <div align="center">![pnpm](https://skillicons.dev/icons?i=pnpm)<br>pnpm</div> | Fast JS package manager | Installs project dependencies quickly and efficiently |
| <div align="center">![Kafka](https://skillicons.dev/icons?i=kafka)<br>Kafka</div> | Distributed event streaming platform | Handles message brokering; ensures messages are decoupled & can be processed reliably |
| <div align="center">![Redis](https://skillicons.dev/icons?i=redis)<br>Redis</div> | In-memory data store | Enables Socket.io pub/sub for scaling across servers |
| <div align="center">![Docker](https://skillicons.dev/icons?i=docker)<br>Docker</div> | Container platform | Runs Kafka, Zookeeper, and Redis services for consistent local dev & deployment |
| <div align="center">![Git](https://skillicons.dev/icons?i=git)<br>Git</div> | Version control | Tracks code changes in the project |
| <div align="center">![GitHub](https://skillicons.dev/icons?i=github)<br>GitHub</div> | Code hosting platform | Hosts repository for collaboration, CI/CD, and backups |
