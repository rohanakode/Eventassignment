const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-platform", 
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
  },
});

const upload = multer({ storage: storage });


const {
  getEvents,
  createEvent,
  deleteEvent,
  rsvpEvent,
  updateEvent,
  getEventById,
  getDashboardEvents,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");



router.get("/", getEvents);


router.post("/", protect, upload.single("image"), createEvent);

router.get("/user/dashboard", protect, getDashboardEvents);
router.get("/:id", getEventById);
router.post("/:id/rsvp", protect, rsvpEvent);

router.put("/:id", protect, upload.single("image"), updateEvent);

router.delete("/:id", protect, deleteEvent);

module.exports = router;
