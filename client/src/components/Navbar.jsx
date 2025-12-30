import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "20px 40px", // More breathing room
        background: "#222",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Subtle shadow for depth
      }}
    >
      {/* LOGO - Made Bigger */}
      <Link to="/" style={{ textDecoration: "none", color: "white" }}>
        <h1
          style={{
            margin: 0,
            cursor: "pointer",
            fontSize: "2rem",
            letterSpacing: "1px",
          }}
        >
          Event Platform
        </h1>
      </Link>

      {/* NAVIGATION LINKS - Made Bigger */}
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        {" "}
        {/* Gap handles spacing better */}
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        {token ? (
          <>
            <Link to="/dashboard" style={linkStyle}>
              Dashboard
            </Link>

            <Link
              to="/create-event"
              style={{ ...linkStyle, color: "#4CAF50", fontWeight: "bold" }}
            >
              + Create Event
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: "#e74c3c", // Nice Red
                color: "white",
                border: "none",
                padding: "12px 24px", // Bigger button
                fontSize: "1.1rem",
                cursor: "pointer",
                borderRadius: "8px",
                fontWeight: "bold",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#c0392b")}
              onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link
              to="/register"
              style={{
                ...linkStyle,
                background: "white",
                color: "#222",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

// Reusable style for links to keep code clean
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "1.2rem", // Increased text size
  fontWeight: "500",
  transition: "color 0.2s",
};

export default Navbar;
