import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const res = await axios.get("/api/events/user/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCreatedEvents(res.data.createdEvents);
        setJoinedEvents(res.data.joinedEvents);
      } catch (err) {
        console.error("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading dashboard...
      </div>
    );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: "40px", fontSize: "2.5rem", color: "#333" }}>
        My Dashboard
      </h1>

      {/* SECTION 1: EVENTS I ORGANIZED */}
      <div style={{ marginBottom: "60px" }}>
        <h2
          style={{
            borderBottom: "2px solid #eee",
            paddingBottom: "15px",
            marginBottom: "25px",
            color: "#444",
          }}
        >
          Events I Organized 🛠️
        </h2>
        {createdEvents.length === 0 ? (
          <p style={{ color: "#777", fontSize: "1.1rem" }}>
            You haven't created any events yet.
          </p>
        ) : (
          <div style={gridStyle}>
            {createdEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => handleCardClick(event._id)}
                isOwner={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: EVENTS I'M ATTENDING */}
      <div>
        <h2
          style={{
            borderBottom: "2px solid #eee",
            paddingBottom: "15px",
            marginBottom: "25px",
            color: "#444",
          }}
        >
          Events I'm Attending 🎟️
        </h2>
        {joinedEvents.length === 0 ? (
          <p style={{ color: "#777", fontSize: "1.1rem" }}>
            You haven't joined any events yet.
          </p>
        ) : (
          <div style={gridStyle}>
            {joinedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => handleCardClick(event._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- REUSABLE COMPONENT: Event Card ---
const EventCard = ({ event, onClick, isOwner }) => (
  <div
    onClick={onClick}
    style={{
      border: "1px solid #eee",
      borderRadius: "12px",
      padding: "15px",
      cursor: "pointer",
      background: "white",
      display: "flex",
      gap: "20px",
      alignItems: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      transition: "transform 0.2s",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    {/* IMAGE SECTION - UPDATED FOR CLOUDINARY */}
    <div
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "8px",
        overflow: "hidden",
        flexShrink: 0,
        background: "#f5f5f5",
      }}
    >
      {event.image ? (
        <img
          src={event.image} // Clean & Simple!
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ccc",
          }}
        >
          No Img
        </div>
      )}
    </div>

    {/* TEXT CONTENT */}
    <div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "#222" }}>
        {event.title}
      </h3>
      <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
        📅 {new Date(event.date).toLocaleDateString()}
      </p>
      {isOwner && (
        <span
          style={{
            display: "inline-block",
            marginTop: "8px",
            fontSize: "0.8rem",
            color: "#d35400",
            background: "#fadbd8",
            padding: "2px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          You are Organizer
        </span>
      )}
    </div>
  </div>
);

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "25px",
};

export default DashboardPage;
