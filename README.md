# **Task Manager App**

A simple task management application using **Node.js, Express, MongoDB, and EJS**.

## **Features**
- **User authentication** (signup, login, logout)
- **Add, edit, delete tasks**
- **Secure JWT-based authentication**
- **Responsive UI with Bootstrap**

## **Tech Stack**
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** EJS, Bootstrap
- **Authentication:** JWT & Bcrypt

## **Installation**

### **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
2. Install Dependencies
npm install
3. Set Up Environment Variables
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=your port
4. Start the Server
node index.js
5. Open in Browser
Visit: http://localhost:3000
Or live link: https://taskmanager-wzus.onrender.com
Project Structure
/TaskManagerApp
│── /models
│   ├── user.js
│   ├── task.js
│── /views
│   ├── home.ejs
│   ├── login.ejs
│   ├── signup.ejs
│   ├── task.ejs
│── /middleware
│   ├── authMiddleware.js
│── app.js (main file)
│── package.json
│── README.md
│── .env
