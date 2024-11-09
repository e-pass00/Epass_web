import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/stores/authStore';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = () => {
  const { user, loading, openModal } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      openModal(location.pathname);
    }
  }, [loading, user, location.pathname, openModal]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Rediriger vers la page de confirmation si l'email n'est pas vérifié
  if (
    !user.emailVerified &&
    location.pathname !== '/confirm' &&
    location.pathname !== '/'
  ) {
    return <Navigate to="/confirm" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
