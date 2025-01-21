import { Outlet } from 'react-router-dom';
import Header from './Header';
import ResponsiveNavigation from './ResponsiveNavigation';

const Layout = () => (
  <>
    <Header />
    <main>
      <Outlet />
      <ResponsiveNavigation />
    </main>
  </>
);

export default Layout;
