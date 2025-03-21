import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton, Button } from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  CalendarToday,
  LocationOn,
  ArrowForward,
} from '@mui/icons-material';
import styled, { keyframes, css } from 'styled-components';
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

const overlayAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledIconButton = styled(IconButton)`
  transition: all 0.3s ease;
  &.liked {
    animation: ${pulseAnimation} 0.3s ease;
  }
`;

const EventContainer = styled(Box)`
  position: relative;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  overflow: hidden;
  border-radius: 16px;

  @media (min-width: 960px) {
    &:hover .event-overlay {
      opacity: 1;
      visibility: visible;
    }

    &:hover .event-image {
      transform: scale(1.05);
      filter: brightness(0.7);
    }
  }
`;

const ImageContainer = styled(Box)`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
`;

const EventOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 2;
  border-radius: 16px;

  & > * {
    animation: ${overlayAppear} 0.5s forwards;
  }

  & > *:nth-child(2) {
    animation-delay: 0.1s;
  }
`;

const ViewMoreButton = styled(Button)`
  margin-top: 16px;
  background-color: #3ecf8e;
  color: #000;
  font-weight: bold;
  border-radius: 30px;
  padding: 8px 20px;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: 1px;

  &:hover {
    background-color: #2ebf7e;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(62, 207, 142, 0.3);
  }
`;

const EventImage = styled(Box)`
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 16px;
  transition:
    transform 0.5s ease,
    filter 0.5s ease;
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
    <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
      <EventContainer
        sx={{
          width: '100%',
          maxWidth: 400,
          borderRadius: '16px',
          paddingBottom: 0,
          marginBottom: '-20px',
        }}
      >
        <ImageContainer>
          <EventImage
            component="img"
            src={event.coverImage}
            alt={event.name}
            className="event-image"
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
              zIndex: 3,
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
              zIndex: 3,
            }}
            className={isLiked ? 'liked' : ''}
          >
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </StyledIconButton>

          {/* Overlay effect for desktop */}
          <EventOverlay className="event-overlay">
            <Typography
              variant="h5"
              sx={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: '22px',
                textAlign: 'center',
                maxWidth: '80%',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {event.name}
            </Typography>
            <ViewMoreButton variant="contained" endIcon={<ArrowForward />}>
              Voir plus
            </ViewMoreButton>
          </EventOverlay>
        </ImageContainer>
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
      </EventContainer>
    </Link>
  );
};

export default EventCome;
