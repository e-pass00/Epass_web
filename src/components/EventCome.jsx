import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  CalendarToday,
  LocationOn,
} from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToggleFavorite } from '../features/events/api/queries';
import { useFavoritesStore } from '../features/events/stores/favoritesStores';
import useAuthStore from '../features/auth/stores/authStore';
import { useState, useEffect } from 'react';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledIconButton = styled(IconButton)`
  transition: all 0.3s ease;
  &.liked {
    animation: ${pulseAnimation} 0.3s ease;
  }
`;

const formatDate = (dateString) => {
  return format(new Date(dateString), 'EEE, d MMMM', { locale: fr });
};

const EventCome = ({ event }) => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#131313',
        p: 1,
      }}
    >
      <EventCard event={event} />
    </Box>
  );
};

const EventCard = ({ event }) => {
  const { mutate: toggleFavorite, isLoading } = useToggleFavorite();
  const favorites = useFavoritesStore((state) => state.favorites);
  const { user, loading, openModal } = useAuthStore();
  const location = useLocation();
  const [optimisticLiked, setOptimisticLiked] = useState(null);

  // Calculer l'état réel du like
  const realLikeState =
    user && event.interestedId
      ? event.interestedId.includes(user.uid)
      : favorites.includes(event.id);

  // Utiliser l'état optimiste s'il existe, sinon utiliser l'état réel
  const isLiked = optimisticLiked !== null ? optimisticLiked : realLikeState;

  // Mettre à jour l'état optimiste si l'état réel change et qu'il n'y a pas d'optimistic update en cours
  useEffect(() => {
    if (optimisticLiked !== null && realLikeState === optimisticLiked) {
      setOptimisticLiked(null);
    }
  }, [realLikeState, optimisticLiked]);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loading && !user) {
      openModal(location.pathname);
      return;
    }

    if (!isLoading) {
      const newLikeState = !isLiked;
      setOptimisticLiked(newLikeState);

      toggleFavorite(event.id, {
        onError: () => {
          // En cas d'erreur, revenir à l'état précédent
          setOptimisticLiked(!newLikeState);
        },
      });
    }
  };

  return (
    <Link
      to={`/events/${event.id}`}
      style={{ textDecoration: 'none', cursor: 'default' }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: '16px',
          paddingBottom: 0,
          marginBottom: '-20px',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={event.coverImage}
            alt={event.name}
            sx={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1 / 1',
              objectFit: 'cover',
              borderRadius: '16px',
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#3ECF8E',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
            letterSpacing={1}
          >
            {event.category}
          </Typography>
          <StyledIconButton
            onClick={handleLikeClick}
            disabled={isLoading}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              color: isLiked ? 'red' : 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)!important',
              },
            }}
            className={isLiked ? 'liked' : ''}
          >
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </StyledIconButton>
        </Box>
        <Box sx={{ p: 1 }}>
          <Typography
            variant="h5"
            sx={{
              color: '#F1F1F1',
              fontWeight: 'bold',
              fontSize: '18px',
              mb: 1,
            }}
            letterSpacing={1}
          >
            {event.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday sx={{ color: '#99c0e0', fontSize: 16, mr: 1 }} />
              <Typography
                variant="body1"
                sx={{ color: '#d9d9d9', fontSize: '13px' }}
                letterSpacing={1}
              >
                {formatDate(event.startDate)}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#3ECF8E',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'flex-start',
              }}
              fontFamily="Montserrat"
            >
              {event.minPrice}
              <Typography
                component="sup"
                sx={{
                  fontSize: '12px',
                  lineHeight: 1,
                  marginLeft: '2px',
                  verticalAlign: 'top',
                  fontWeight: 'bold',
                }}
                fontFamily="Montserrat"
              >
                XAF
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn
              sx={{ color: '#99c0e0', fontSize: 19, ml: '-1.3px', mr: 1 }}
            />
            <Typography
              variant="body1"
              sx={{ color: '#d9d9d9', fontSize: '13px' }}
              letterSpacing={1}
            >
              {event.locationName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default EventCome;
