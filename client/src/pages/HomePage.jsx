import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading events...</div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {" "}
      {/* Centered Container */}
      <h1
        style={{
          textAlign: "center",
          margin: "40px 0",
          fontSize: "2.5rem",
          color: "#333",
        }}
      >
        Upcoming Events
      </h1>
      {/* --- BIGGER SEARCH BAR --- */}
      <div style={{ maxWidth: "800px", margin: "0 auto 50px auto" }}>
        <input
          type="text"
          placeholder="🔍 Search events by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "15px 20px",
            fontSize: "1.2rem", // Bigger text
            borderRadius: "30px", // Rounder corners
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            outline: "none",
          }}
        />
      </div>
      <div
        style={{
          display: "grid",
          // Changed from 250px to 350px so cards are much wider
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "40px", // More space between cards
          padding: "10px",
        }}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              style={{
                background: "white",
                border: "1px solid #eee",
                borderRadius: "16px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)", // Softer, bigger shadow
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/events/${event._id}`)}
              // Lift effect
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-8px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* BIGGER IMAGE SECTION */}
              <div
                style={{
                  height: "250px", // Increased from 180px
                  background: "#f9f9f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {event.image ? (
                  <img
                    src={event.image} // Cloudinary URLs are full links, so just use event.image!
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <span style={{ color: "#aaa", fontSize: "1.2rem" }}>
                    No Image
                  </span>
                )}
              </div>

              {/* CONTENT SECTION */}
              <div
                style={{
                  padding: "25px", // More breathing room
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "1.6rem",
                    textAlign: "center",
                    color: "#222",
                  }}
                >
                  {event.title}
                </h3>

                <button
                  style={{
                    width: "100%",
                    padding: "15px", // Bigger button
                    fontSize: "1.1rem",
                    background: "#222",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.background = "#444")}
                  onMouseOut={(e) => (e.target.style.background = "#222")}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              width: "100%",
              gridColumn: "1/-1",
              fontSize: "1.2rem",
              color: "#777",
              marginTop: "20px",
            }}
          >
            No events found matching "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
