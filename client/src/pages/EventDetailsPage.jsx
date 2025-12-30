import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api"; // 👈 HERE IS THE IMPORT YOU WANTED

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // We use 'api.get' instead of 'axios.get'
        // The URL is cleaner because 'api' already knows the server address
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This cannot be undone."
      )
    ) {
      try {
        await api.delete(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Event Deleted!");
        navigate("/");
      } catch (err) {
        alert("Error deleting event");
      }
    }
  };

  const handleRSVP = async () => {
    if (!token) return alert("Please login first");
    try {
      await api.post(
        `/api/events/${id}/rsvp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Joined Successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error joining");
    }
  };

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading event details...
      </div>
    );
  if (!event)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Event not found
      </div>
    );

  const isOwner =
    user &&
    event.organizer &&
    (user.id === event.organizer._id || user.id === event.organizer);

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "20px" }}>
      {/* --- BACK BUTTON --- */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "#f0f0f0",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        ← Back to Home
      </button>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          overflow: "hidden",
          background: "white",
        }}
      >
        {/* --- HEADER IMAGE --- */}
        <div
          style={{
            height: "400px",
            background: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <h2 style={{ color: "#aaa" }}>No Image Available</h2>
          )}
        </div>

        <div style={{ padding: "30px" }}>
          <h1 style={{ marginBottom: "15px", fontSize: "2.5rem" }}>
            {event.title}
          </h1>
          <p
            style={{
              color: "#555",
              fontSize: "1.2rem",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
            }}
          >
            {event.description}
          </p>

          <div
            style={{
              marginTop: "30px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "10px",
              border: "1px solid #eee",
            }}
          >
            <p>
              <strong>📅 Date:</strong>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p>
              <strong>📍 Location:</strong> {event.location}
            </p>
            <p>
              <strong>👥 Capacity:</strong> {event.attendees.length} /{" "}
              {event.capacity}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
            <button
              onClick={handleRSVP}
              style={{
                padding: "15px 30px",
                background: "#333",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
            >
              {token ? "Join Event" : "Login to Join"}
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/edit-event/${id}`)}
                  style={{
                    padding: "15px 30px",
                    background: "orange",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: "15px 30px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
