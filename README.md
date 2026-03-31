# 🚀 Real-Time Chat & Payment Dashboard

A full-stack web application with **user authentication, real-time chat, and payment module** built using modern technologies.

---

## 🔥 Features

* 🔐 JWT Authentication (Login system)
* 💬 Real-time Chat using Socket.IO
* 👥 User-to-User Messaging
* 💰 Payment Module (basic structure)
* 🛡️ Protected Routes (React Router)
* ⚡ Instant Message UI (Optimistic Update)
* 🎯 Clean Dashboard UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Socket.IO
* JWT Authentication

---

## 📁 Project Structure

```
client/
  ├── pages/
  │   ├── Login.jsx
  │   ├── Chat.jsx
  │   ├── Users.jsx
  │   └── Payments.jsx
  ├── api/
  │   └── api.js
  └── App.jsx

server/
  ├── models/
  ├── routes/
  ├── controllers/
  └── server.js
```

---

## ⚙️ Installation


### Backend Setup

```bash
npm install
npm run dev
```

---

### Frontend Setup

```bash
npm install
npm start
```

---

## 🔐 Authentication

* User login using **name**
* JWT token generated and stored in localStorage
* Protected routes using React Router

---

## 💬 Chat Functionality

* Real-time messaging with Socket.IO
* One-to-one chat
* Instant UI update (no delay)
* Message timestamps

---

## 📸 Screens

* Login Page
* Chat Dashboard
* Users List
* Payments Page

---

## 🚀 Future Improvements

* ✅ Message seen/delivered status
* ✅ Typing indicator
* 🔐 End-to-End Encryption
* 📱 Mobile Responsive UI
* 🔔 Notifications


