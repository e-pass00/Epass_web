import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  styled,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import { useEvents } from '../features/events/api/queries';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const OuterContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '40px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  '&::before': {
    left: 0,
    background: 'linear-gradient(to right,  #131313, rgba(18,18,18,0))',
  },
  '&::after': {
    right: 0,
    background: 'linear-gradient(to left,  #131313, rgba(18,18,18,0))',
  },
}));

const EventsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  position: 'relative',
  cursor: 'grab',
  backgroundColor: 'transparent',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
}));

const EventCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  flexShrink: 0,
  backgroundColor: '#1E1E1E',
  width: '86vw',

  [theme.breakpoints.up('sm')]: {
    width: '35vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '26vw',
  },
  [theme.breakpoints.up('lg')]: {
    width: '16vw',
  },
}));

const EventImage = styled(CardMedia)(({ theme }) => ({
  height: '86vw',
  [theme.breakpoints.up('xs')]: {
    height: '100vw',
  },
  [theme.breakpoints.up('sm')]: {
    height: '35vw',
  },
  [theme.breakpoints.up('md')]: {
    height: '28vw',
  },
  [theme.breakpoints.up('lg')]: {
    height: '18vw',
  },
}));

const EventOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '2px 2px 5px 10px',
  color: '#F1F1F1',
});

const TransparentOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '70px',
  background: 'rgba(0, 0, 0, 0.3)',
});

const EventCategory = styled(Typography)({
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#3ECF8E',
  padding: '4px 8px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: 1,
});

const EventDate = styled(Box)({
  position: 'absolute',
  top: 12,
  right: 12,
  backgroundColor: '#ffff',
  color: 'black',
  padding: '2px 6px',
  borderRadius: '6px',
  textAlign: 'center',
});

const EventTitle = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '6px',
  fontSize: '1.2rem',
  color: '#F1F1F1',
});

const EventLocation = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.8rem',
  lineHeight: '12px',
});

const ViewAllButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  color: '#3ECF8E',
  cursor: 'pointer',
});

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(8, 8, 8, 0.8)',
  boxShadow: '0 0 0 10px rgba(0,0,0,0.3)',
  '&:hover': {
    backgroundColor: 'rgba(9, 9, 9, 1)',
  },
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const ClickableEventCard = styled(EventCard)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const PopularEvents = ({ activeCategory }) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const { data: eventsData, isLoading, error } = useEvents();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const checkForScroll = () => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      const hasHorizontalScroll = scrollWidth > clientWidth;
      setHasScroll(hasHorizontalScroll);
      setShowRightButton(hasHorizontalScroll);
    }
  };

  useEffect(() => {
    checkForScroll();

    const handleResize = () => {
      checkForScroll();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [eventsData]);

  const handleScroll = () => {
    if (containerRef.current && hasScroll) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const scrollRight = scrollWidth - clientWidth - scrollLeft;

      setShowLeftButton(scrollLeft > 20);
      setShowRightButton(scrollRight > 20);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasScroll]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount =
        direction === 'left'
          ? -container.offsetWidth / 2
          : container.offsetWidth / 2;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <Typography color="#F1F1F1">Chargement des événements...</Typography>
    );
  }

  if (error) {
    return <Typography color="#F1F1F1">Erreur: {error.message}</Typography>;
  }

  // Filter events based on category
  const filteredEvents = eventsData?.data
    ? eventsData.data.filter((event) =>
        activeCategory === 'Tout voir'
          ? true
          : event.category === activeCategory
      )
    : [];

  // Return early if no events for specific category (not "Tout voir")
  if (activeCategory !== 'Tout voir' && filteredEvents.length === 0) {
    return null;
  }

  // Sort events by popularity
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => b.popularity - a.popularity
  );

  // Apply display rules
  const getDisplayedEvents = () => {
    if (activeCategory === 'Tout voir') {
      return sortedEvents.slice(0, 15);
    }

    if (isMobile) {
      const totalEvents = sortedEvents.length;

      if (totalEvents === 1) return sortedEvents;
      if (totalEvents <= 3) return sortedEvents.slice(0, totalEvents - 1);
      if (totalEvents <= 5) return sortedEvents.slice(0, 2);
      if (totalEvents === 6) return sortedEvents.slice(0, 3);
      if (totalEvents >= 7) return sortedEvents.slice(0, 5);
    }

    return sortedEvents;
  };

  const displayedEvents = getDisplayedEvents();
  const shouldShowViewAll = isMobile ? displayedEvents.length >= 2 : hasScroll;

  return (
    <Container
      maxWidth={false}
      disableGutters={isMobile}
      sx={{
        maxWidth: {
          xs: '100%',
          sm: '98%',
          md: '94%',
          lg: '94%',
        },
        mx: 'auto',
      }}
    >
      <Box
        paddingTop="10px"
        position="relative"
        sx={{
          backgroundColor: '#131313',
          overflowX: 'hidden',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          px={isMobile ? 2 : 0}
        >
          <Box display="flex" alignItems="center">
            <StarIcon style={{ color: '#3ECF8E', marginRight: '5px' }} />
            <Typography
              variant="h5"
              fontSize="20px"
              fontWeight="bold"
              color="#F1F1F1"
              fontFamily="Roboto"
            >
              Populaires{' '}
              {activeCategory !== 'Tout voir' && `- ${activeCategory}`}
            </Typography>
          </Box>
          {shouldShowViewAll && (
            <ViewAllButton>
              <Typography variant="body2">Tout afficher</Typography>
              <ArrowForwardIosIcon
                style={{
                  marginLeft: '7px',
                  color: '#F1F1F1',
                  fontSize: '16px',
                }}
              />
            </ViewAllButton>
          )}
        </Box>

        {!isMobile && hasScroll && showLeftButton && (
          <ScrollButton
            onClick={() => scroll('left')}
            style={{ left: '10px', color: '#F1F1F1' }}
          >
            <ArrowBackIosNewIcon />
          </ScrollButton>
        )}
        {!isMobile && hasScroll && showRightButton && (
          <ScrollButton
            onClick={() => scroll('right')}
            style={{ right: '10px', color: '#F1F1F1' }}
          >
            <ArrowForwardIosIcon />
          </ScrollButton>
        )}

        <OuterContainer>
          <EventsContainer
            ref={containerRef}
            sx={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
            }}
          >
            {displayedEvents.map((event, index) => {
              const eventDate = new Date(event.startDate);
              return (
                <Link
                  to={`/events/${event.id}`}
                  style={{ textDecoration: 'none', cursor: 'default' }}
                >
                  <EventCard
                    key={event.id}
                    sx={{
                      mr: 2,
                      ml: index === 0 ? 2 : 0,
                      scrollSnapAlign: 'center',
                    }}
                  >
                    <EventImage image={event.coverImage} title={event.name} />
                    <TransparentOverlay />
                    <EventCategory variant="subtitle2">
                      {event.category}
                    </EventCategory>
                    <EventDate>
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: 'bold',
                          fontSize: '15px',
                          color: '#3ECF8E',
                        }}
                      >
                        {format(eventDate, 'dd')}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ fontWeight: 'bold', fontSize: '12px' }}
                      >
                        {format(eventDate, 'MMM')}
                      </Typography>
                    </EventDate>
                    <EventOverlay>
                      <EventTitle variant="h6">{event.name}</EventTitle>
                      <EventLocation variant="body2">
                        <LocationOnIcon
                          style={{
                            marginRight: '5px',
                            fontSize: '18px',
                            color: '#F1F1F1',
                          }}
                        />
                        {event.city}, {event.locationName}
                      </EventLocation>
                    </EventOverlay>
                  </EventCard>
                </Link>
              );
            })}
          </EventsContainer>
        </OuterContainer>
      </Box>
    </Container>
  );
};

export default PopularEvents;
