
import { theme } from "../theme";

function PageLayout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: theme.dark,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "80px"
    }}>
      {children}
    </div>
  );
}

export default PageLayout;