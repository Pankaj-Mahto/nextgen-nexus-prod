
📝 Job Portal with Resume Builder

![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)

A full-stack **Nextgen-Nexus** application built with the **MERN stack**. Users can search and apply for jobs, create professional resumes using the built-in resume builder, and track their applications.  

**Live Demo:** [https://nextgen-nexus-prod.onrender.com](https://nextgen-nexus-prod.onrender.com)

---

## 🌟 Features

- **Job Search & Apply:** Browse jobs by category, location, or role and apply directly through the platform.  
- **Resume Builder:** Create, edit, and download professional resumes easily.  
- **User Authentication:** Secure signup/login system with JWT authentication.  
- **Dashboard:** Personalized dashboard to track applications and saved jobs.  
- **Responsive Design:** Fully responsive layout for desktop, tablet, and mobile devices.  

---


## 🛠 Tech Stack

- **Frontend:** React, HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT  
- **Deployment:** Render  

---

## 📥 Getting Started (Local Setup)

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-portal-resume-builder.git
cd job-portal-resume-builder
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the Project Locally

```bash
# Start the backend server
npm run server

# Start the frontend
npm start
```

The app will run at: `http://localhost:3000`

---

## 🚀 Deployment (Render)

The project is deployed on **Render**:
🔗 [https://nextgen-nexus-prod.onrender.com](https://nextgen-nexus-prod.onrender.com)

To deploy your own copy:

1. Push your code to GitHub.
2. Go to [Render.com](https://render.com/) and connect your GitHub repository.
3. Add your environment variables (`MONGO_URI`, `JWT_SECRET`, etc.) in Render’s dashboard.
4. Click **Deploy** to launch your app live.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/YourFeatureName
```

3. Make your changes and test locally.
4. Commit your changes:

```bash
git commit -m "Add new feature: YourFeatureName"
```

5. Push to your branch:

```bash
git push origin feature/YourFeatureName
```

6. Open a pull request in the original repository.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

---
