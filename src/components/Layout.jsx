import { Outlet } from "react-router-dom";
import Header from "./Header";
import ResponsiveNavigation from "./ResponsiveNavigation";

const Layout = () => (
  <div>
    <Header />
    <main>
      <Outlet />
      <ResponsiveNavigation />
    </main>
  </div>
);

export default Layout;
