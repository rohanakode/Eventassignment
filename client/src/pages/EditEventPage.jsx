import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // Updated import

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        const event = res.data;
        // Format date for input field
        const formattedDate = new Date(event.date).toISOString().split("T")[0];
        setFormData({
          title: event.title,
          description: event.description,
          date: formattedDate,
          location: event.location,
          capacity: event.capacity,
        });
      } catch (err) {
        alert("Error fetching event details");
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event Updated Successfully!");
      navigate(`/events/${id}`);
    } catch (err) {
      alert("Error updating event");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h2>Edit Event</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={{ padding: "10px" }}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          required
          style={{ padding: "10px" }}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ padding: "10px" }}
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          style={{ padding: "10px" }}
        />
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          required
          style={{ padding: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            background: "orange",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
