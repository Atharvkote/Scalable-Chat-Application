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
✅ Perfect — here’s your updated **README tables** with everything you listed:

---

## 🚀 Tech Stack Overview

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

---

##  DevOps & Observability Stack 
(Yet to be added...)

| Technology                                                                                         | Description                 | Role in Project                                                              |
| -------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| <div align="center">![Jenkins](https://skillicons.dev/icons?i=jenkins)<br>Jenkins</div>            | Automation server           | CI/CD pipeline to build, test, and deploy the application                    |
| <div align="center">![Docker](https://skillicons.dev/icons?i=docker)<br>Docker</div> | Image registry              | Stores built container images for consistent deployments 
| <div align="center">![Prometheus](https://skillicons.dev/icons?i=prometheus)<br>Prometheus</div> | Metrics monitoring system | Collects and stores time-series data, powering Grafana dashboards for system metrics |
| <div align="center">![Grafana](https://skillicons.dev/icons?i=grafana)<br>Grafana</div>            | Visualization tool          | Dashboards for monitoring metrics & logs                                     |
| <div align="center">![Sentry](https://skillicons.dev/icons?i=sentry)<br>Sentry</div>               | Error tracking & monitoring | Captures exceptions, frontend & backend errors, with alerts and stack traces |
| <div align="center"><br>Trivy</div>                                                             | Security scanner            | Scans Docker images for vulnerabilities before pushing to prod               |


