import { useEffect, useState } from "react";
import api from "../api"; // Updated import
import { Link } from "react-router-dom";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events");
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Upcoming Events
      </h1>
      <input
        type="text"
        placeholder="🔍 Search events by title or location..."
        style={{
          width: "60%",
          padding: "12px",
          display: "block",
          margin: "0 auto 40px auto",
          borderRadius: "20px",
          border: "1px solid #ddd",
        }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "25px",
        }}
      >
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "white",
            }}
          >
            <div style={{ height: "180px", background: "#f0f0f0" }}>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{ padding: "15px", textAlign: "center" }}>
              <h3 style={{ margin: "10px 0" }}>{event.title}</h3>
              <Link to={`/events/${event._id}`}>
                <button
                  style={{
                    padding: "8px 15px",
                    background: "#222",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {filteredEvents.length === 0 && (
        <p style={{ textAlign: "center", color: "#777", marginTop: "20px" }}>
          No events found matching "{search}"
        </p>
      )}
    </div>
  );
};

export default HomePage;
