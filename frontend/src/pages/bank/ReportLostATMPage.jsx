import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";
import PageLayout from "../../components/PageLayout";
import { theme } from "../../theme";

function ReportLostATMPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    card_holder: "",
    account_number: "",
    bank_name: "",
    card_type: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch(
        `${BASE_URL}/atm/reports/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit report");
      }

      alert("ATM report submitted");

      navigate("/bank/dashboard");

    } catch (err) {

      console.error(err);

      alert("Submission failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <PageLayout>

      <div style={wrapper}>

        <h2 style={title}>
          Report Lost ATM
        </h2>

        <form
          onSubmit={handleSubmit}
          style={form}
        >

          <input
            type="text"
            name="card_holder"
            placeholder="Card Holder Name"
            value={formData.card_holder}
            onChange={handleChange}
            style={input}
            required
          />

          <input
            type="text"
            name="account_number"
            placeholder="Account Number"
            value={formData.account_number}
            onChange={handleChange}
            style={input}
            required
          />

          <input
            type="text"
            name="bank_name"
            placeholder="Bank Name"
            value={formData.bank_name}
            onChange={handleChange}
            style={input}
            required
          />

          <input
            type="text"
            name="card_type"
            placeholder="Card Type"
            value={formData.card_type}
            onChange={handleChange}
            style={input}
            required
          />

          <button
            type="submit"
            style={button}
          >

            {loading
              ? "Submitting..."
              : "Submit Report"}

          </button>

        </form>

      </div>

    </PageLayout>
  );
}

const wrapper = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "24px",
};

const title = {
  marginBottom: "20px",
  color: theme.dark,
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const input = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
};

const button = {
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: theme.primary,
  color: "#fff",
  fontWeight: "700",
  cursor: "pointer",
};

export default ReportLostATMPage;