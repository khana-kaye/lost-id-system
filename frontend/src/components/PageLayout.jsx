
import { theme } from "../theme";

function PageLayout({ children }) {
  return (
    <div  className="min-h-screen, flex, flex-col items-center"
    >
      {children}
    </div>
  );
}

export default PageLayout;