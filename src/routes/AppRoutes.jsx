import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import EventDetailsPage from '../pages/EventDetailsPage';
import TicketsPage from '../pages/TicketsPage';
import FavoritesPage from '../pages/FavoritesPage';
import ProfilePage from '../pages/ProfilePage';
import EventDashboardPage from '../pages/EventDashboardPage';
import Layout from '../components/Layout';
import ConfirmMailPage from '../pages/ConfirmMailPage';
import ProtectedRoute from '../components/ProtectedRoute';
import CategoryBilletPage from '../pages/CatergoryBilletPage';
import NotFoundPage from '../pages/NotFoundPage';

import AllPopularEvents from '../pages/AllPopularEvents';

const AppRoutes = () => (
  <Routes>
    <Route path="/events/:id" element={<EventDetailsPage />} />
    <Route path="/category/:id" element={<CategoryBilletPage />} />
    <Route path="/popular" element={<AllPopularEvents />} />
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>

    <Route path="/dashboard/:id" element={<EventDashboardPage />} />
    <Route path="/confirm" element={<ConfirmMailPage />} />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
export default AppRoutes;
