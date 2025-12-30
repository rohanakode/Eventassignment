const Event = require("../models/Event");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "username email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "username"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user's events (Created & Joined)
// @route   GET /api/events/user/dashboard
// @access  Private
exports.getDashboardEvents = async (req, res) => {
  try {
    const createdEvents = await Event.find({ organizer: req.user._id });
    const joinedEvents = await Event.find({ attendees: req.user._id });

    res.json({ createdEvents, joinedEvents });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  // --- CLOUDINARY CHANGE HERE ---
  let imagePath = "";
  if (req.file) {
    // Cloudinary gives us the full URL in .path
    imagePath = req.file.path;
  }
  // ------------------------------

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
      image: imagePath, // Save the URL directly
      organizer: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Join an event (RSVP)
// @route   POST /api/events/:id/rsvp
// @access  Private
exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: "You already joined this event" });
    }

    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.json({ message: "RSVP Successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Owner Only)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);

    // --- CLOUDINARY CHANGE HERE ---
    if (req.file) {
      event.image = req.file.path; // Update with new Cloudinary URL
    }
    // ------------------------------

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Owner Only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
