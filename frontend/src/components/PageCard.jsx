import { theme } from "../theme";

function PageCard({ children }) {
  return (
    <div style={wrapper}>
      {children}
    </div>
  );
}

const wrapper = {
  flex: 1,
  height: "100%",
  minHeight: 0,
  background: theme.card,
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  border: "1px solid rgba(255,255,255,0.16)",
  padding: "20px",

  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export default PageCard;