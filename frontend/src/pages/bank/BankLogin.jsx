import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import { useAuth } from "../../context/AuthContext";
import BASE_URL from "../../api";

function BankLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/bank/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Not JSON response:", text);
        throw new Error("Backend returned non-JSON response. Check API endpoint URL.");
      }

      if (res.ok) {
        // Store auth state consistently
        localStorage.setItem("staff_id", data.staff_id || "");
        localStorage.setItem("username", data.username || username);
        if (data.bank_name) {
          localStorage.setItem("bank_name", data.bank_name);
        }

        setUser({
          username: data.username || username,
          role: "BANK",
          staff_id: data.staff_id || "",
          bank_name: data.bank_name || "",
        });

        navigate("/bank/dashboard");
      } else {
        setErrorMessage(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Bank login error:", error);
      setErrorMessage("Server error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="w-full max-w-[420px] mx-auto p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 w-full">
          <h2 className="m-0 mb-2 text-3xl font-bold text-gray-900">
            Bank Staff Login
          </h2>
          <p className="m-0 mb-6 text-gray-600 text-sm">
            Access your bank portal account.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="bank-username" className="sr-only">Username</label>
              <input
                id="bank-username"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 outline-none text-sm text-gray-900 placeholder-gray-500 shadow-sm transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            <div className="relative w-full">
              <label htmlFor="bank-password" className="sr-only">Password</label>
              <input
                id="bank-password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-16 rounded-2xl border border-gray-300 outline-none text-sm text-gray-900 placeholder-gray-500 shadow-sm transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-gray-700 hover:text-black text-xs font-bold px-1 py-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errorMessage && (
              <p role="alert" className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-sm font-medium">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gray-900 text-white hover:bg-black font-bold text-base rounded-2xl shadow-lg shadow-gray-900/20 cursor-pointer transition focus:outline-none focus:ring-4 focus:ring-gray-900/30 active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            No account?{" "}
            <Link
              to="/bank/signup"
              className="text-gray-900 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-gray-900 rounded-sm"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default BankLogin;