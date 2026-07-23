import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageLayout from "../../components/PageLayout";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        if (result.staff_id) {
          localStorage.setItem("staff_id", result.staff_id);
        }
        navigate("/admin");
      } else {
        setErrorMessage(
          result.message || "Invalid credentials. Please try again."
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        "Login failed. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="w-full max-w-[420px] mx-auto p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 w-full">
          <h2 className="m-0 mb-2 text-3xl font-bold text-gray-900">
            Officer Login
          </h2>
          <p className="m-0 mb-6 text-gray-600 text-sm">
            Sign in to access the Police dashboard.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="officer-username" className="sr-only">
                Username
              </label>
              <input
                id="officer-username"
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 outline-none text-sm text-gray-900 placeholder-gray-500 shadow-sm transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="relative w-full">
              <label htmlFor="officer-password" className="sr-only">
                Password
              </label>
              <input
                id="officer-password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-16 rounded-2xl border border-gray-300 outline-none text-sm text-gray-900 placeholder-gray-500 shadow-sm transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent text-gray-700 hover:text-black text-xs font-bold px-1 py-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl text-sm font-medium"
              >
                {errorMessage}
              </p>
            )}

            {/* Orange theme preserved with standard Tailwind amber classes */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-amber-500 text-white hover:bg-amber-600 font-bold text-base rounded-2xl shadow-lg shadow-amber-500/25 cursor-pointer transition focus:outline-none focus:ring-4 focus:ring-amber-500/30 active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-amber-600 font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-sm"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

export default LoginPage;