# Salon-Booking-Chat-Application

A **professional multi-service salon booking chat application** built with **React, Node.js, Express.js, and MongoDB**. This AI-powered chat assistant allows users to book, view, and cancel appointments for multiple salon services like Haircut, Shaving, Trimming, Facewash, Manicure, and Pedicure.

## 📌 Features

- Real-time chat interface with **bot and user messages**.
- **Multiple services booking**: Haircut, Shaving, Trimming, Facewash, Manicure, Pedicure.
- **View booked appointments**.
- **Cancel appointments**.
- Quick reply buttons for fast user interaction.
- **Typing indicator** for better UX.
- **Responsive and professional UI** with avatars, shadows, and hover effects.



## 🛠 Tech Stack

- **Frontend**: React, HTML, CSS, Tailwind (optional)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (NoSQL)
- **Communication**: REST API
- **Other**: Nodemon (for development), Fetch API

- 
## 🚀 Installation

### 1. Clone the repository

bash
git clone https://github.com/<your-username>/salon-booking-chat.git
cd salon-booking-chat

### 2. Backend setup
cd backend
npm install


### Configure MongoDB connection in server.js:

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/salon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


### Start the backend server:

npm run dev
# or
node server.js
