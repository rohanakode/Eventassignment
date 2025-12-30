#  Event Platform - MERN Stack Assignment

A full-stack Event Management Platform built with **MongoDB, Express.js, React.js, and Node.js**. Users can create events with images, browse upcoming events, and RSVP in real-time.

##  Live Demo
- **Frontend (Vercel):** https://mini-event-platform-cxn088gmb-rohanakodes-projects.vercel.app/
- **Backend (Render):** https://event-platform-api-jahk.onrender.com


## Features Implemented
- **User Authentication:** Secure Login & Registration using JWT (JSON Web Tokens).
- **Event Management:** Create, Read, Update, and Delete (CRUD) events.
- **Image Uploads:** Seamless image hosting using **Cloudinary**.
- **RSVP System:** Real-time seat booking with capacity validation.
- **Dashboard:** Personalized view of hosted events and joined events.
- **Search & Filter:** Find events by title or location instantly.
- **Responsive Design:** Fully optimized for mobile and desktop.


##  Technical Explanation: Handling Concurrency & Capacity
**The Challenge:**
In a high-traffic scenario, two users might try to book the **last available seat** at the exact same millisecond. If we simply read the current capacity, check if it's > 0, and then update it, both requests might pass the check before the database updates, resulting in **Overbooking** (more attendees than capacity).

**The Solution: Atomic Updates with MongoDB `$addToSet` & Query Conditions**
Instead of a "Read-then-Write" approach, I implemented an **Atomic Operation** directly within the database query.

**Code Strategy:**
```javascript
const event = await Event.findOneAndUpdate(
  { 
    _id: req.params.id, 
    $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] } // Condition: Current attendees < Capacity
  },
  { 
    $addToSet: { attendees: req.user.id } // Action: Add user only if condition is met
  },
  { new: true }
);

if (!event) {
  return res.status(400).json({ message: "Event is full or you already joined!" });
}

Instructions for Running Locally

1. Prerequisites
Node.js installed (v16 or higher)
MongoDB Atlas Account (or local MongoDB)
Cloudinary Account (for images)

2. Clone the Repository
git clone [https://github.com/rohanakode/event-platform.git]
cd event-platform

3. Setup Backend (Server)
cd server
npm install

Create a .env file in the server folder with your credentials:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Start the server:
node server.js

4. Setup Frontend (Client)
cd client
npm install

Create a .env file in the client folder
VITE_API_URL=http://localhost:5000

Start the React app:
npm run dev

5. Access the App
Open your browser and visit: http://localhost:5173


event-platform/
├── client/           # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/    # Page Components (Home, Dashboard, etc.)
│   │   └── api.js    # Centralized Axios Configuration
│   └── vercel.json   # Deployment Configuration
├── server/           # Node.js/Express Backend
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API Endpoints
│   └── server.js     # Entry Point
└── README.md         # Documentation






