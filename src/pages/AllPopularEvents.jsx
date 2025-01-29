import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  styled,
  AppBar,
  Toolbar,
  Container,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from 'date-fns';
import { useEvents } from '../features/events/api/queries';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'sticky',
});

const PageContainer = styled(Box)({
  backgroundColor: '#0A0A0A',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

const CategoryHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const CategoryWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '8px',
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontSize: '28px',
  fontWeight: 600,
  color: '#fff',
  position: 'relative',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40%',
    height: '2px',
    background: '#3ECF8E',
    [theme.breakpoints.up('sm')]: {
      left: 0,
      transform: 'none',
    },
  },
}));

const EventCounter = styled(Typography)(({ theme }) => ({
  fontSize: '15px',
  color: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: '3px',
    height: '3px',
    background: '#3ECF8E',
    borderRadius: '50%',
    marginRight: '8px',
  },
}));

const EventsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(1, 1fr)',
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    padding: theme.spacing(4),
  },
}));

const EventCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  cursor: 'pointer',
  transition:
    'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',

  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: '#111111',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    '& .eventImage': {
      transform: 'translate(-50%, -50%) scale(1.05)',
    },
  },
}));

const EventImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '66.67%', // Ratio 3:2
  overflow: 'hidden',
  backgroundColor: '#1A1A1A',
}));

const EventImage = styled('img')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
}));

const EventContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  position: 'relative',
}));

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  color: 'rgba(241, 241, 241, 0.7)',
});

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: '#3ECF8E',
  color: '#fff',
  fontWeight: 500,
  fontSize: '0.75rem',
  height: '24px',
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

const TitleWrapper = styled(Box)({
  paddingRight: '80px',
});

const AllPopularEvents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: eventsData, isLoading } = useEvents();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('Tout voir');

  useEffect(() => {
    if (location.state?.events) {
      setEvents(location.state.events);
      setCategory(location.state.category || 'Tout voir');
    } else if (eventsData?.data) {
      const sortedEvents = [...eventsData.data].sort(
        (a, b) => b.popularity - a.popularity
      );
      setEvents(sortedEvents);
    }
  }, [location.state, eventsData]);

  const handleBack = () => navigate(-1);
  const handleEventClick = (eventId) => navigate(`/events/${eventId}`);

  if (isLoading) {
    return (
      <Box sx={{ p: 3, color: '#fff' }}>
        <Typography>Chargement des événements...</Typography>
      </Box>
    );
  }

  return (
    <PageContainer>
      <StyledAppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Événements populaires
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <CategoryHeader>
          <CategoryWrapper>
            <CategoryTitle>{category}</CategoryTitle>
            <EventCounter>{events.length} événements</EventCounter>
          </CategoryWrapper>
        </CategoryHeader>

        <EventsGrid>
          {events.map((event) => (
            <EventCard
              key={event.id}
              onClick={() => handleEventClick(event.id)}
            >
              <EventImageContainer>
                <EventImage
                  className="eventImage"
                  src={event.coverImage || '/api/placeholder/900/600'}
                  alt={event.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/900/600';
                  }}
                />
              </EventImageContainer>

              <EventContent>
                <TitleWrapper>
                  <Typography
                    variant="h6"
                    color="#F1F1F1"
                    fontWeight="500"
                    gutterBottom
                  >
                    {event.name}
                  </Typography>
                </TitleWrapper>

                <CategoryChip label={event.category} size="small" />

                <Box
                  sx={{
                    mt: 3,
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 2,
                  }}
                >
                  <InfoItem>
                    <CalendarTodayIcon
                      sx={{ fontSize: '1.1rem', opacity: 0.7 }}
                    />
                    <Typography variant="body2">
                      {format(new Date(event.startDate), 'dd MMMM yyyy')}
                    </Typography>
                  </InfoItem>
                  <InfoItem>
                    <LocationOnIcon sx={{ fontSize: '1.1rem', opacity: 0.7 }} />
                    <Typography variant="body2">
                      {event.city}, {event.locationName}
                    </Typography>
                  </InfoItem>
                </Box>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
      </Container>
    </PageContainer>
  );
};

export default AllPopularEvents;
