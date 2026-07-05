import Sidebar from "./Sidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <div className="app-layout__sidebar">
        <Sidebar />
      </div>
      <main className="app-layout__main">{children}</main>
    </div>
  );
};

export default AppLayout;
