# Keeper App (React Spring) 📝

KeeperApp is a **React + Spring Boot** application designed to capture, organize, and review learning notes in a clean, timeline-based experience. The project was born out of an **ideation collaboration** with the Django-based project **[Learning Log](https://github.com/imniladri/Learning-Log)** and reimagines the same learning-journal concept using a modern Java + React stack.

This repository focuses on the **frontend (React)** and **backend (Spring Boot)** integration, emphasizing scalability, clean architecture, and real-world full‑stack practices.

---

## ✨ Project Vision

The goal of KeeperApp is to provide learners and developers with a structured way to:

* Track daily learning entries
* Organize notes chronologically (newest first)
* Revisit concepts efficiently
* Understand how a React frontend can interact with different backend architectures

This project also serves as a **learning bridge**—translating an idea originally implemented in Django into a **Spring Boot ecosystem**.

---

### 🧠 Project Reimplementation

* **Reimplemented by:** [Niladri Mondal](https://github.com/imniladri)
* **New Concept:** [Keeper App (React Spring)](https://github.com/imniladri/KeeperApp-React-Spring-Project)

### 🧠 Ideation & Inspiration

* **Ideation Owner:** [Sourajeet Dey](https://github.com/Sourajeet-Dey)
* **Original Concept:** [Learning Log (Django)](https://github.com/Sourajeet-Dey/learning_log)

KeeperApp is not a direct clone but a **conceptual evolution**, adapting the Learning Log idea into a React + Spring architecture while experimenting with improved UI flows and API design.

---

## 🛠️ Tech Stack

### Frontend

* **React** (Functional Components & Hooks)
* **React Router** – Dynamic routing
* **Axios** – API communication
* **CSS** – Custom styling

### Backend

* **Spring Boot** – RESTful API
* **Spring Data JPA** – Database abstraction
* **Hibernate** – ORM
* **MySQL / PostgreSQL** (configurable)

### Deployments Env

* **[Vercel](https://vercel.com/dashboard)** - Client Deployment Tool (FrontEnd) (Free Tire)
* **[Render](https://dashboard.render.com/)** - Server Deployment Tool (BackEnd) (Free Tire)
* **[Cron Job](https://console.cron-job.org/dashboard)** - Server Uptime Check (Execution Interval 15 Mins)
* **[TiDB Cloud](https://tidbcloud.com/tidbs)** - Cloud Database (MySQL DB) (Free Tire)

Currently having only Production environment, other environments will be included in future releases.

---

## 📦 Features

* 📌 Create, view, update, and delete learning entries
* 🕒 Timeline-based display (newest entries first)
* 🔗 REST API integration with Spring Boot
* 📂 Clean component-based UI structure
* 🔄 Scalable backend-ready architecture

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v16+ recommended)
* npm or yarn
* Java 17+
* Maven
* Spring Boot backend running

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/imniladri/KeeperApp-React-Spring-Project.git

# Navigate to project directory
cd KeeperApp-React-Spring-Project/client

# Install dependencies
npm install

# Start the development server
npm start or npm run dev

# Application will be available at:
http://localhost:8080
```

### Backend Setup

Ensure the Spring Boot backend is running and the API base URL is correctly configured in:

```js
// src/utils/API_URL.js
const API_URL = "http://localhost:8080/api";
export default API_URL;
```

```bash
# Clone the repository
git clone https://github.com/imniladri/KeeperApp-React-Spring-Project.git

# Navigate to project directory
cd KeeperApp-React-Spring-Project/server

# Build the project
mvn clean install

# Run the application spring boot server
mvn spring-boot:run

_Or run the JAR file after building:_
java -jar target/keeperapp-0.0.1-SNAPSHOT.jar

# Application will be available at:
http://localhost:8090
```

---

## 🗄️ Database Schema

The application uses a **relational database design** implemented with **MySQL / PostgreSQL** and managed using **Spring Data JPA & Hibernate**.

<img width="500" alt="schema-keeperapp" src="https://github.com/user-attachments/assets/947211ed-64ec-4440-96d8-ce438ddb325d" />

> ⚠️ **Note:**  
> The schema may evolve as new features such as dashboard, categorization, enhanced editor and security enhancements are added.

---

## 🔄 API Overview

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| GET    | `/entries`      | Fetch all entries  |
| GET    | `/entries/{id}` | Fetch entry by ID  |
| POST   | `/entries`      | Create a new entry |
| PUT    | `/entries/{id}` | Update an entry    |
| DELETE | `/entries/{id}` | Delete an entry    |

---

## 📚 Learning Outcomes

This project helps in understanding:

* React state management with hooks
* Timeline-based data rendering
* RESTful API consumption
* Spring Boot + React integration
* Translating ideas across backend frameworks

---

## 📌 Future Enhancements

* 🔐 Authentication & Authorization
* 🏷️ Tags & Categories
* 🔍 Search & Filter entries
* 📊 Analytics dashboard
* ☁️ Cloud deployment (Docker + AWS)

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it for learning and development purposes.

---

### ⭐ If you find this project helpful, consider giving it a star on GitHub!
