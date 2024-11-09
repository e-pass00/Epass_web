import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../features/auth/stores/authStore';
import { CircularProgress, Box } from '@mui/material';

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useAuthStore();

  // Extraire les valeurs du store de manière sûre
  const user = store.user;
  const loading = store.loading;
  const initialize = store.initialize;

  useEffect(() => {
    if (typeof initialize === 'function') {
      const cleanup = initialize();
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    } else {
      console.error('initialize is not a function in useAuthStore');
    }
  }, [initialize]);

  //   useEffect(() => {
  //     if (!isInitialized || loading) {
  //       return; // Ne pas rediriger pendant le chargement
  //     }
  //     // Si l'utilisateur est connecté mais n'a pas vérifié son email
  //     if (user && !user.emailVerified && location.pathname !== '/confirm') {
  //       navigate('/confirm');
  //     }
  //   }, [user, location.pathname, navigate]);

  //   if (loading) {
  //     return (
  //       <Box
  //         display="flex"
  //         justifyContent="center"
  //         alignItems="center"
  //         minHeight="100vh"
  //       >
  //         <CircularProgress />
  //       </Box>
  //     );
  //   }

  return children;
};

export default AuthProvider;
