const Event = require("../models/Event");


exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "username email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


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


exports.getDashboardEvents = async (req, res) => {
  try {
    const createdEvents = await Event.find({ organizer: req.user._id });
    const joinedEvents = await Event.find({ attendees: req.user._id });

    res.json({ createdEvents, joinedEvents });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.createEvent = async (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  
  let imagePath = "";
  if (req.file) {
    
    imagePath = req.file.path;
  }
 

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      capacity,
      image: imagePath, 
      organizer: req.user._id,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};


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


exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    Object.assign(event, req.body);

    
    if (req.file) {
      event.image = req.file.path; 
    }
   

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


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
