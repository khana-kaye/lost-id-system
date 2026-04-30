


// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
    
//     <nav style={{
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       padding: '20px 60px',
//       background: '#fff',
//       borderBottom: '1px solid #eee'
//     }}>

//       {/* LEFT: Logo */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//         <div style={{
//           width: 35,
//           height: 35,
//           borderRadius: 6,
//           background: '#0d2b4c',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: '#fff'
//         }}>
//           🔍
//         </div>

//         <span style={{
//           color: '#0d2b4c',
//           fontSize: 18,
//           fontWeight: 600
//         }}>
//           Lost ID Tracker
//         </span>
//       </div>

//       {/* CENTER: Links */}
//       <div style={{ display: 'flex', gap: 30 }}>
//         <Link to="/" style={linkStyle}>
//           Home
//         </Link>
//         <Link to="/search" style={linkStyle}>
//           Search IDs
//         </Link>
//         <Link to="/admin" style={linkStyle}>
//           Police Portal
//         </Link>
//       </div>

//       {/* RIGHT: Button */}
//       <button style={{
//         border: '2px solid orange',
//         background: 'transparent',
//         color: 'orange',
//         padding: '10px 18px',
//         borderRadius: 6,
//         cursor: 'pointer',
//         fontWeight: 500
//       }}>
//         Emergency Report
//       </button>

//     </nav>
//   );
// }

// /* Reusable style */
// const linkStyle = {
//   textDecoration: 'none',
//   color: '#333',
//   fontSize: 15,
//   fontWeight: 500
// };

// export default Navbar;


import { Link, useNavigate} from "react-router-dom";


function Navbar() {
  const navigate = useNavigate()
  return (
    <nav style={navStyle}>
      {/* LEFT: Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={logoBox}>🔍</div>

        <span style={titleStyle}>
          Lost ID Tracker
        </span>
      </div>

      {/* CENTER: Links */}
      <div style={{ display: "flex", gap: "30px" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/search" style={linkStyle}>Search IDs</Link>
        <Link to="/report" style={linkStyle}>Report</Link>
        <Link to="/admin" style={linkStyle}>Police Portal</Link>
      </div>

      {/* RIGHT: Button */}
      <button style={buttonStyle}
      onClick={() => navigate("/report")}>
        Emergency Report
      </button>
    </nav>
  );
}

/* STYLES */
const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "15px 40px",
  background: "#fff",
  borderBottom: "1px solid #eee",
};

const logoBox = {
  width: 35,
  height: 35,
  borderRadius: 6,
  background: "#0d2b4c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
};

const titleStyle = {
  color: "#0d2b4c",
  fontSize: 18,
  fontWeight: 600,
};

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: 15,
  fontWeight: 500,
};

const buttonStyle = {
  border: "2px solid orange",
  background: "transparent",
  color: "orange",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 500,
};

export default Navbar;