import {
  Box,
  Typography,
  Grid,
  AppBar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFavoriteEvents } from './../features/events/api/queries';
import useAuthStore from '../features/auth/stores/authStore';
import { useNavigate } from 'react-router-dom';
import EventCome from '../components/EventCome';

const EmptyFavorites = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      width: '100%',
      gap: 3,
      padding: 4,
    }}
  >
    <Heart size={64} className="text-gray-400" strokeWidth={1.5} />
    <Typography
      variant="h5"
      sx={{
        fontWeight: 'medium',
        textAlign: 'center',
        color: 'text.primary',
      }}
    >
      Aucun favori pour le moment
    </Typography>
    <Typography
      variant="body1"
      sx={{
        textAlign: 'center',
        color: 'text.secondary',
        maxWidth: '500px',
      }}
    >
      Explorez nos événements et ajoutez-les à vos favoris en cliquant sur le
      cœur. Vous pourrez ainsi les retrouver facilement ici !
    </Typography>
  </Box>
);

const FavoritesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isMediumScreen = useMediaQuery('(max-width:768px)');
  const [scrolled, setScrolled] = useState(false);
  const appBackground = theme.palette.background.default;

  const {
    data: favoriteEvents,
    isLoading,
    isError,
    error,
  } = useFavoriteEvents();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    if (isMediumScreen) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMediumScreen]);

  const getLighterColor = () => {
    const baseColor = appBackground.replace('#', '');
    const r = parseInt(baseColor.substr(0, 1), 16);
    const g = parseInt(baseColor.substr(1, 1), 16);
    const b = parseInt(baseColor.substr(3, 1), 16);

    const lighterAmount = scrolled ? 22 : 15;

    const newR = Math.min(255, r + lighterAmount);
    const newG = Math.min(255, g + lighterAmount);
    const newB = Math.min(255, b + lighterAmount);

    return `#${newR.toString(16).padStart(2, '0')}${newG
      .toString(16)
      .padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const TitleComponent = isMediumScreen ? (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: scrolled ? 1 : 0,
        backgroundColor: getLighterColor(),
        transition: 'background-color 0.3s ease',
        top: '0',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          fontSize: '23px',
          color: '#ffff',
          paddingLeft: '5%',
          paddingY: '15px',
        }}
      >
        Vos favoris
      </Typography>
    </AppBar>
  ) : (
    <Typography
      variant="h6"
      sx={{
        mt: 4,
        mb: 2,
        fontWeight: 'bold',
        fontSize: '23px',
        color: '#ffff',
        paddingLeft: {
          md: '5%',
          xs: '5%',
        },
        marginBottom: '0px',
      }}
    >
      Vos favoris
    </Typography>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (isError) {
      console.log(error);
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            {error?.message || 'Erreur lors du chargement des favoris'}
          </Alert>
        </Box>
      );
    }

    if (!favoriteEvents?.length) {
      return <EmptyFavorites />;
    }

    return (
      <Grid
        container
        spacing={1.5}
        sx={{
          maxWidth: {
            xs: '98%',
            sm: '95%',
            md: '92%',
            lg: '92%',
          },
          height: {
            xs: '100%',
            sm: '97%',
            md: '94%',
            lg: '94%',
          },
          '& .MuiGrid-item': {
            display: 'flex',
            justifyContent: 'center',
          },
        }}
      >
        {favoriteEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <EventCome event={event} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        color: 'text.primary',
        marginTop: {
          sm: isMediumScreen ? '50px' : '100px',
          xs: '45px',
        },
      }}
    >
      <Box sx={{ pt: '1px', pb: '10px' }}>
        {TitleComponent}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: isMediumScreen ? 2 : 0,
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default FavoritesPage;
