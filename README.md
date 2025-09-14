# Salon-Booking-Chat-Application

A **professional multi-service salon booking chat application** built with **React, Node.js, Express.js, and MongoDB**. This AI-powered chat assistant allows users to book, view, and cancel appointments for multiple salon services like Haircut, Shaving, Trimming, Facewash, Manicure, and Pedicure.

---

## 📌 Features

- Real-time chat interface with **bot and user messages**.
- **Multiple services booking**: Haircut, Shaving, Trimming, Facewash, Manicure, Pedicure.
- **View booked appointments**.
- **Cancel appointments**.
- Quick reply buttons for fast user interaction.
- **Typing indicator** for better UX.
- **Responsive and professional UI** with avatars, shadows, and hover effects.

---

## 🛠 Tech Stack

- **Frontend**: React, HTML, CSS, Tailwind (optional)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (NoSQL)
- **Communication**: REST API
- **Other**: Nodemon (for development), Fetch API

---

## 📁 Project Structure

salon-booking-chat/
├─ backend/
│ ├─ controllers/
│ │ └─ agentController.js
│ ├─ models/
│ │ ├─ Appointment.js
│ │ └─ Stylist.js
│ ├─ routes/
│ │ └─ agentRoutes.js
│ ├─ server.js
│ └─ package.json
├─ frontend/
│ ├─ src/
│ │ ├─ components/
│ │ │ └─ ChatWidget.jsx
│ │ ├─ App.js
│ │ └─ index.js
│ ├─ public/
│ └─ package.json
├─ .gitignore
└─ README.md

yaml
Copy code

---

## 🚀 Installation

### 1. Clone the repository


git clone https://github.com/<your-username>/salon-booking-chat.git
cd salon-booking-chat

2. Backend setup
cd backend
npm install

Configure MongoDB connection in server.js:

javascript

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/salon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
Start the backend server:


npm run dev
# or
node server.js
Backend runs on http://localhost:4000

3. Frontend setup

cd frontend
npm install
npm start
Frontend runs on http://localhost:3000 and communicates with backend.

💬 Usage
Open the frontend in your browser.

Start chatting with the Salon Assistant.

Type or select service options from quick replies.

Book an appointment:

confirm <time>
Example:
confirm 09:30

View booked appointments:
view appointments

Cancel an appointment:
cancel <time>
Example:
cancel 09:30

🎨 UI / UX
Responsive chat widget with avatars.

Colored quick-replies for each service.

Smooth hover and focus effects.

Typing indicator for bot responses.

🔧 Future Improvements
Add user authentication (login/signup).

Use real AI/NLP for better understanding user messages.

Support multiple stylists with separate schedules.

Add notifications for upcoming appointments.

Deploy on Vercel/Heroku with MongoDB Atlas.
