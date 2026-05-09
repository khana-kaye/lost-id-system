import { useState } from "react";

function NiraAuth() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: 20 }}>
          {isLogin ? "NIRA Login" : "NIRA Signup"}
        </h2>

        {!isLogin ? (
          <>
            <input placeholder="Full Name" style={input} />
            <input placeholder="Staff ID" style={input} />
            <input placeholder="National ID Number" style={input} />
            <input placeholder="Email" style={input} />
            <input type="password" placeholder="Password" style={input} />

            <button style={btn}>Create Account</button>

            <p style={text}>
              Already have an account?{" "}
              <span style={link} onClick={() => setIsLogin(true)}>
                Login
              </span>
            </p>
          </>
        ) : (
          <>
            <input placeholder="Email or ID Number" style={input} />
            <input type="password" placeholder="Password" style={input} />
            

            <button style={btn}>Login</button>

            <p style={text}>
              Don’t have an account?{" "}
              <span style={link} onClick={() => setIsLogin(false)}>
                Sign up
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#0d2b4c",
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "10px",
  width: "350px",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "orange",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const text = {
  marginTop: "15px",
  fontSize: "14px",
};

const link = {
  color: "blue",
  cursor: "pointer",
  textDecoration: "underline",
};

export default NiraAuth;