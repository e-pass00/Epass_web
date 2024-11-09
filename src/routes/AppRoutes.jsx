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

const AppRoutes = () => (
  <Routes>
    <Route path="/events/:id" element={<EventDetailsPage />} />
    <Route path="/category/:id" element={<CategoryBilletPage />} />
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />

      {/* Routes protégées */}
      {/* Changement ici : on utilise element={<ProtectedRoute />} */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>
    {/* Route de confirmation d'email */}
    <Route path="/dashboard" element={<EventDashboardPage />} />
    <Route path="/confirm" element={<ConfirmMailPage />} />
  </Routes>
);

export default AppRoutes;
