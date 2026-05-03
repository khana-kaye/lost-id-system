// function Landingpage() {
//   return (
//     <div style={{
//         background: 'white',
//       minHeight: '100vh',
//       display: 'flex', flexDirection: 'column',
//       alignItems: 'center', justifyContent: 'center',
//       padding: '60px 24px 80px'
//     }}>
//       {/* Title */}
//       <h1 style={{ color: '#000', fontSize: 48, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>
//         Track Your Lost ID
//       </h1>

//       {/* Subtitle */}
//       <h2 style={{ color: '#666', fontSize: 24, fontWeight: 400, textAlign: 'center', marginBottom: 30 }}>
//         Lost ID and Driver's Permit Tracking System
//       </h2>

//       {/* Description */}
//       <p style={{
//         color: '#333', fontSize: 18,
//         textAlign: 'center', maxWidth: 600, lineHeight: 1.6, marginBottom: 40
//       }}>
//         Our comprehensive system helps you locate lost National IDs and Driver's Permits.
//         Whether you've misplaced your identification or found someone else's documents,
//         our database allows you to search, report, and recover important identification documents
//         quickly and securely. Officers can also manage entries and updates through our secure portal.
//       </p>

//       {/* Buttons */}
//       <div style={{ display: 'flex', gap: 20 }}>
//         <button
//           style={{
//             background: '#3a5fd9', color: '#fff', border: 'none',
//             padding: '15px 30px', borderRadius: 8,
//             fontSize: 18, fontWeight: 600, cursor: 'pointer',
//             transition: 'background-color 0.3s'
//           }}
//           onMouseOver={(e) => e.target.style.backgroundColor = '#2c4aa0'}
//           onMouseOut={(e) => e.target.style.backgroundColor = '#3a5fd9'}
//         >
//           Search Database
//         </button>
//         <button
//           style={{
//             background: '#28a745', color: '#fff', border: 'none',
//             padding: '15px 30px', borderRadius: 8,
//             fontSize: 18, fontWeight: 600, cursor: 'pointer',
//             transition: 'background-color 0.3s'
//           }}
//           onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
//           onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
//         >
//           Officer Entry
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Landingpage;

import { useNavigate } from "react-router-dom";
import homeImage from "../assets/home.jpeg";

function Landingpage() {
  const navigate = useNavigate();

  return (


    



    <div style={{
      background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${homeImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px'
    }}>

      

      {/* LEFT SIDE */}
      <div style={{ maxWidth: '520px' }}>
        {/* BIG TITLE */}
        <h1 style={{
          color:'white',
          fontSize: 50,
          fontWeight: 700,
          marginBottom: 20
        }}>
          TRACK YOUR LOST ID
        </h1>

        <p style={{
          color: '#eee',
          fontSize: 18,
          lineHeight: 1.6,
          marginBottom: 25
        }}>
          Securely search our verified database to locate your lost driver's permit
          or National ID. Report found documents and help reconnect people with their identity.
        </p>

        {/* 🔍 SEARCH INPUT */}
        <input
          type="text"
          placeholder="Enter ID Number or Name..."
          style={{
            width: '100%',
            padding: '14px',
            marginBottom: 20,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16
          }}
        />

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
          <button style={primaryBtn} onClick={() => navigate("/search")}>
            Search Database
          </button>

          <button style={secondaryBtn} onClick={() => navigate("/report")}>
            Report Found ID
          </button>

          <button style={outlineBtn} onClick={() => navigate("/admin")}>
            Officer Entry
          </button>
        </div>
      </div>

      
    

    </div>
  );
}


/* BUTTON STYLES */
const primaryBtn = {
  background: 'orange',
  color: '#fff',
  border: 'none',
  padding: '12px 22px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600
};

const secondaryBtn = {
  background: '#28a745',
  color: '#fff',
  border: 'none',
  padding: '12px 22px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600
};

const outlineBtn = {
  border: '2px solid orange',
  background: 'transparent',
  padding: '12px 22px',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600
};

export default Landingpage;