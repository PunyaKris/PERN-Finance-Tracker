import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
