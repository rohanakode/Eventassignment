import { useState } from "react";
import api from "../api"; // Updated import
import { useNavigate } from "react-router-dom";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState(null); // File object

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in");

    // Use FormData for file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("capacity", capacity);
    if (image) {
      formData.append("image", image);
    }

    try {
      // Note: Content-Type header is auto-set by axios/api when sending FormData
      await api.post("/api/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Event Created Successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating event");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Create New Event
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <label>Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ padding: "10px" }}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="4"
          style={{ padding: "10px" }}
        ></textarea>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <label>Capacity</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
          style={{ padding: "10px" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "darkgreen",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            fontSize: "1rem",
          }}
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;
