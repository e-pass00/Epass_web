import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  ShareOutlined,
  CalendarToday,
  LocationOn,
  Check,
  AttachMoney,
  FavoriteBorder,
  QueryBuilder,
  Map as MapIcon,
} from '@mui/icons-material';
import styled, { keyframes, css } from 'styled-components';
import { Video, Image } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEvent, useToggleFavorite } from '../features/events/api/queries';
import { useFavoritesStore } from '../features/events/stores/favoritesStores';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useAuthStore from '../features/auth/stores/authStore';

// Default values
const DEFAULT_EVENT = {
  id: '',
  name: 'Événement sans nom',
  description: 'Aucune description disponible',
  location: {
    city: 'Ville non spécifiée',
    name: 'Lieu non spécifié',
    coordinates: {
      latitude: null,
      longitude: null,
    },
  },
  organizerName: 'Organisateur inconnu',
  organizerProfilePicture: '',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  coverImage: '/api/placeholder/400/300',
  coverVideo: null,
  categoriesBillets: [],
  interestedId: [],
};

// Animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const rotateTo3D = keyframes`
  0% {
    opacity: 1;
    filter: blur(0px);
    transform: perspective(1000px) scale(1);
  }
  50% {
    opacity: 0.5;
    filter: blur(6px);
    transform: perspective(1000px) scale(0.9);
  }
  100% {
    opacity: 0;
    filter: blur(10px);
    transform: perspective(1000px) scale(0.8);
  }
`;

// Styled components
const StyledIconButton = styled(IconButton)`
  transition: all 0.3s ease;
  &.liked {
    animation: ${pulseAnimation} 0.3s ease;
  }
`;

const MapButton = styled(IconButton)`
  background-color: #3ecf8e !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background-color: #45a49a !important;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StyledBox = styled.div`
  position: relative;
  top: 0;
  z-index: 0;
  height: ${({ isMobile }) => (isMobile ? '40vh' : 'auto')};
  perspective: 1000px;
`;

const StyledMedia = styled.div`
  width: 100%;
  height: ${({ isMobile }) => (isMobile ? '40vh' : 'auto')};
  position: relative;
`;

const mediaStyles = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${({ isLeaving }) => (isLeaving ? 0 : 1)};
  transition: opacity 0.3s linear;
  animation: ${({ isLeaving }) =>
    isLeaving
      ? css`
          ${rotateTo3D} 2s linear forwards
        `
      : 'none'};
`;

const StyledVideo = styled.video`
  ${mediaStyles}
`;

const StyledImage = styled.img`
  ${mediaStyles}
`;

const ExitButton = styled.button`
  position: absolute;
  bottom: 100px;
  right: 20px;
  padding: 8px;
  background-color: #3ecf8e;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  z-index: 100;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #60ccc2;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

// Helper functions
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'EEE, d MMMM', { locale: fr });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Date non spécifiée';
  }
};

const formatTime = (dateString) => {
  try {
    return format(new Date(dateString), 'HH:mm');
  } catch (error) {
    console.error('Time formatting error:', error);
    return '--:--';
  }
};

const safeArray = (array) => (Array.isArray(array) ? array : []);

// Main component
const ArtistProfile = ({ event: rawEvent }) => {
  const event = { ...DEFAULT_EVENT, ...rawEvent };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedCategory, setSelectedCategory] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasReachedAppBar, setHasReachedAppBar] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(null);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const { user, loading, openModal } = useAuthStore();
  const location = useLocation();

  const { mutate: toggleFavorite, isLoading } = useToggleFavorite();
  const favorites = useFavoritesStore((state) => state.favorites);

  // Safe favorites check
  const realLikeState = Boolean(
    (user && safeArray(event.interestedId).includes(user.uid)) ||
      safeArray(favorites).includes(event.id)
  );

  const isEventFavorite =
    optimisticLiked !== null ? optimisticLiked : realLikeState;

  const handleMapOpen = () => {
    if (
      event.location?.coordinates?.latitude &&
      event.location?.coordinates?.longitude
    ) {
      const url = `https://www.google.com/maps?q=${event.location.coordinates.latitude},${event.location.coordinates.longitude}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Initialize selected category when event data loads
  useEffect(() => {
    if (event.categoriesBillets && event.categoriesBillets.length > 0) {
      setSelectedCategory(event.categoriesBillets[0].name);
    }
  }, [event.categoriesBillets]);

  useEffect(() => {
    if (optimisticLiked !== null && realLikeState === optimisticLiked) {
      setOptimisticLiked(null);
    }
  }, [realLikeState, optimisticLiked]);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;

      const position = cardRef.current.scrollTop;
      setScrollPosition(position);

      const appBarHeight = 35;
      const imageHeight = window.innerHeight * 0.4;
      const threshold = imageHeight - appBarHeight - 1;

      setHasReachedAppBar(position >= threshold / 4);
    };

    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (cardElement) {
        cardElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookClick = (e) => {
    e.preventDefault();

    if (!loading && !user) {
      openModal(location.pathname);
      return;
    }

    if (event.id) {
      navigate(`/category/${event.id}`);
    }
  };

  const handleCategoryChange = (_, newCategory) => {
    console.log('Nouvelle catégorie sélectionnée:', newCategory);
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const handleTransition = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVideo((prev) => !prev);
      setIsLeaving(false);
    }, 2000);
  };

  const handleLikeClick = () => {
    if (!loading && !user) {
      openModal(location.pathname);
      return;
    }

    if (!isLoading && event.id) {
      const newLikeState = !isEventFavorite;
      setOptimisticLiked(newLikeState);

      toggleFavorite(event.id, {
        onError: () => {
          setOptimisticLiked(!newLikeState);
        },
      });
    }
  };

  // Find the selected category data
  const selectedCategoryData = React.useMemo(() => {
    return (
      event.categoriesBillets.find((cat) => cat.name === selectedCategory) || {
        price: 0,
        availableQuantity: 0,
        advantages: [],
      }
    );
  }, [event.categoriesBillets, selectedCategory]);

  const iconButtonStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)!important',
    },
  };

  return (
    <Grid
      container
      spacing={0}
      sx={{
        height: '100vh',
        overflow: 'hidden',
        paddingTop: !isMobile ? '65px' : '0',
      }}
    >
      {!isMobile && (
        <Grid item md={6} lg={8} sx={{ height: '99%', overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#131313',
              padding: theme.spacing(4),
            }}
          >
            <Typography
              variant="h2"
              sx={{ mb: 4, color: '#fff', fontSize: '40px' }}
            >
              {event.name} en concert
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: '60%',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: theme.shape.borderRadius,
              }}
            >
              {isVideo && event.coverVideo ? (
                <StyledVideo isLeaving={isLeaving} controls>
                  <source src={event.coverVideo} type="video/mp4" />
                </StyledVideo>
              ) : (
                <StyledImage
                  isLeaving={isLeaving}
                  src={event.coverImage}
                  alt={event.name}
                  onError={(e) => {
                    e.target.src = DEFAULT_EVENT.coverImage;
                  }}
                />
              )}
              {event.coverVideo && (
                <ExitButton onClick={handleTransition}>
                  {isVideo ? <Image size={26} /> : <Video size={26} />}
                </ExitButton>
              )}
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                Ne manquez pas cet événement exceptionnel !
              </Typography>
              {selectedCategoryData?.availableQuantity > 0 && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleBookClick}
                  sx={{
                    backgroundColor: '#3ECF8E',
                    '&:hover': {
                      backgroundColor: '#45a49a',
                    },
                  }}
                >
                  Réserver maintenant
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      )}

      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        sx={{ height: isMobile ? '100%' : '99%' }}
      >
        <Card
          ref={cardRef}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#131313',
            color: 'text.primary',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: hasReachedAppBar
                ? '#131313'
                : isMobile
                  ? 'transparent'
                  : '#131313',
              transition: 'background-color 0.3s',
              borderBottom: hasReachedAppBar
                ? 'solid 1px #292828'
                : !isMobile
                  ? 'solid 1px #232323'
                  : 'none',
            }}
          >
            <Toolbar>
              <IconButton
                onClick={handleBack}
                edge="start"
                aria-label="back"
                sx={iconButtonStyle}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ ml: 2, flexGrow: 1 }}
                color={
                  hasReachedAppBar
                    ? 'white'
                    : !isMobile
                      ? 'white'
                      : 'transparent'
                }
                transition="color 0.3s"
                fontWeight="bold"
              >
                {event.name}
              </Typography>
              <StyledIconButton
                color="inherit"
                sx={{
                  ...iconButtonStyle,
                  marginRight: '5px',
                  color: isEventFavorite ? 'red' : 'white',
                }}
                onClick={handleLikeClick}
                className={isEventFavorite ? 'liked' : ''}
                disabled={isLoading}
              >
                {isEventFavorite ? <Favorite /> : <FavoriteBorder />}
              </StyledIconButton>
              <IconButton color="inherit" sx={iconButtonStyle}>
                <ShareOutlined />
              </IconButton>
            </Toolbar>
          </AppBar>

          <StyledBox isMobile={isMobile}>
            <StyledMedia isMobile={isMobile}>
              {isVideo && event.coverVideo ? (
                <StyledVideo isLeaving={isLeaving} controls>
                  <source src={event.coverVideo} type="video/mp4" />
                </StyledVideo>
              ) : (
                <StyledImage
                  isLeaving={isLeaving}
                  src={event.coverImage}
                  alt={event.name}
                  onError={(e) => {
                    e.target.src = DEFAULT_EVENT.coverImage;
                  }}
                />
              )}
            </StyledMedia>
            {event.coverVideo && (
              <ExitButton onClick={handleTransition}>
                {isVideo ? <Image size={26} /> : <Video size={26} />}
              </ExitButton>
            )}
          </StyledBox>

          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              backgroundColor: '#131313',
              paddingTop: !isMobile ? '20px' : '',
              zIndex: 0,
              borderLeft: !isMobile ? '1px solid' : '',
              borderLeftColor: '#232323',
              paddingBottom: isMobile ? '100px' : '0',
            }}
          >
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
              display={hasReachedAppBar ? 'none' : 'block'}
              letterSpacing={1}
            >
              {isMobile && event.name}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                position: 'relative',
              }}
            >
              <Avatar
                src={event.organizerProfilePicture}
                sx={{ mr: 1 }}
                alt={event.organizerName}
                onError={(e) => {
                  e.target.src = '/api/placeholder/40/40';
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">
                  {event.organizerName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  letterSpacing={1}
                >
                  Organisateur
                </Typography>
              </Box>
              <MapButton
                onClick={handleMapOpen}
                size="medium"
                sx={{
                  color: 'white',
                  minWidth: '40px',
                  height: '40px',
                }}
              >
                <MapIcon />
              </MapButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  letterSpacing={1}
                >
                  <CalendarToday fontSize="14px" sx={{ mr: '9px' }} />
                  {formatDate(event.startDate)}
                </Typography>
                <Typography
                  variant="body2"
                  letterSpacing={1}
                  sx={{
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <QueryBuilder sx={{ mr: 1, fontSize: '15px' }} />
                  {formatTime(event.startDate)}
                  {event.endDate && ` - ${formatTime(event.endDate)}`}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  letterSpacing={1}
                >
                  <LocationOn sx={{ mr: 1, fontSize: '16px' }} />
                  {event.location?.city || 'Ville non spécifiée'}
                </Typography>
                <Typography variant="body2" letterSpacing={1}>
                  {event.location?.name || 'Lieu non spécifié'}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{ mt: 2, fontSize: '19px', fontWeight: 'bold' }}
            >
              Description
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              letterSpacing={1}
            >
              {event.description}
            </Typography>

            {event.categoriesBillets && event.categoriesBillets.length > 0 && (
              <>
                <Typography
                  variant="h6"
                  sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}
                >
                  Catégories
                </Typography>
                <ToggleButtonGroup
                  value={selectedCategory}
                  exclusive
                  onChange={handleCategoryChange}
                  aria-label="ticket category"
                  sx={{ mb: 2, flexWrap: 'wrap' }}
                >
                  {event.categoriesBillets.map((category) => (
                    <ToggleButton
                      key={category.id || category.name}
                      value={category.name}
                      sx={{
                        mr: 1,
                        mb: 1,
                        border: '1px solid #4a4a4a',
                        color:
                          selectedCategory === category.name
                            ? 'primary.contrastText'
                            : 'text.primary',
                        backgroundColor:
                          selectedCategory === category.name
                            ? '#3ECF8E'
                            : 'transparent',
                        '&.Mui-selected': {
                          backgroundColor: '#3ECF8E',
                          color: 'primary.contrastText',
                        },
                        '&:hover': {
                          backgroundColor:
                            selectedCategory === category.name
                              ? '#3ECF8E'
                              : 'rgba(62, 207, 142, 0.1)',
                        },
                      }}
                    >
                      {category.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </>
            )}

            {selectedCategoryData && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  <AttachMoney sx={{ color: '#3ECF8E', mr: 1 }} />
                  Prix : {selectedCategoryData.price || 0} XAF
                </Typography>
              </Box>
            )}

            {selectedCategoryData?.advantages &&
              selectedCategoryData.advantages.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Avantages :
                  </Typography>
                  <List dense>
                    {selectedCategoryData.advantages.map((advantage, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemIcon
                          sx={{ minWidth: 'auto', mr: 1, color: '#3ECF8E' }}
                        >
                          <Check fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={advantage}
                          primaryTypographyProps={{ letterSpacing: 1 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
          </CardContent>

          <Box
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: '#232323',
              borderRadius: '20px 20px 0 0',
              borderLeft: !isMobile ? '1px solid #232323' : '',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#131313',
              width: '100%',
              position: isMobile ? 'fixed' : 'sticky',
              bottom: 0,
              zIndex: 1,
            }}
          >
            <Typography
              variant="h6"
              color="#3ECF8E"
              fontFamily="Montserrat"
              fontWeight="550"
              fontSize="16px"
            >
              {selectedCategoryData?.price || 0}
              <small>XAF</small>{' '}
              <small style={{ color: '#fff', fontSize: '12px' }}>
                /personne
              </small>
            </Typography>
            <Button
              onClick={handleBookClick}
              variant="contained"
              sx={{
                backgroundColor: '#3ECF8E',
                padding: '8px 30px',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '30px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#45a49a',
                },
              }}
              disabled={!selectedCategoryData?.availableQuantity}
            >
              {selectedCategoryData?.availableQuantity ? 'Réserver' : 'Complet'}
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ArtistProfile;
