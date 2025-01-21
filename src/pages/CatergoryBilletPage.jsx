import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  IconButton,
  Button,
  AppBar,
  Toolbar,
  Container,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useEvent } from '../features/events/api/queries';
import { useEventTicketCategories } from '../features/events/api/queries';
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import PurchaseSummaryModal from '../components/PurchaseSummuryModal';

const PageContainer = styled(Box)({
  backgroundColor: '#1a1a1a',
  minHeight: '100vh',
  color: 'white',
  fontFamily: "'Inter', sans-serif",
  paddingBottom: '120px',
  position: 'relative',
});

const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: '24px',
  [theme.breakpoints.up('md')]: {
    paddingTop: '40px',
  },
}));

const StyledAppBar = styled(AppBar)(({ scrolled, theme }) => ({
  backgroundColor: '#1a1a1a',
  boxShadow: 'none',
  transition: 'background-color 0.3s ease',
  position: 'sticky',
  top: 0,
  zIndex: 1000,

  // Mobile behavior
  [theme.breakpoints.down('md')]: {
    backgroundColor: scrolled ? '#242424' : '#1a1a1a',
    boxShadow: scrolled ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
  },

  // Tablet and desktop behavior
  [theme.breakpoints.up('md')]: {
    backgroundColor: '#242424',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: '56px',
  padding: '0 16px',
});

const HeaderTitle = styled(Typography)({
  fontSize: '20px',
  fontWeight: '500',
  flex: 1,
});

const EventContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  padding: '12px',
  marginBottom: '20px',
  [theme.breakpoints.up('md')]: {
    gap: '24px',
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
}));

const EventImage = styled(Box)(({ theme }) => ({
  width: '100px',
  height: '100px',
  borderRadius: '8px',
  overflow: 'hidden',
  flexShrink: 0,
  [theme.breakpoints.up('md')]: {
    width: '200px',
    height: '200px',
    borderRadius: '12px',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
}));

const EventInfo = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100px',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    height: '200px',
    paddingLeft: '24px',
  },
}));

const EventTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '4px',
  [theme.breakpoints.up('md')]: {
    fontSize: '28px',
    marginBottom: '8px',
  },
}));

const EventDetail = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '12px',
  marginBottom: '2px',
  [theme.breakpoints.up('md')]: {
    fontSize: '14px',
    marginBottom: '4px',
  },
}));

const TicketsGrid = styled(Grid)(({ theme }) => ({
  padding: '0 16px',
  [theme.breakpoints.up('sm')]: {
    padding: '0 32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
}));

const TicketCard = styled(Box)(({ theme, isComplete }) => ({
  position: 'relative',
  backgroundColor: '#242424',
  borderRadius: '12px',
  margin: '2px 0',
  height: '150px',
  display: 'flex',
  opacity: isComplete ? 0.7 : 1,
  transition: 'transform 0.2s ease-in-out',
  [theme.breakpoints.up('md')]: {
    height: '180px',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
}));

const TicketLeft = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  padding: '20px',
  position: 'relative',
  alignItems: 'flex-start',
  [theme.breakpoints.up('md')]: {
    padding: '24px',
  },
}));

const TicketContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const TicketDividerContainer = styled(Box)({
  position: 'relative',
  width: '1px',
  margin: '0 -18px',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '24px',
    height: '24px',
    background: '#1a1a1a',
    borderRadius: '50%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  '&::before': {
    top: '-12px',
  },
  '&::after': {
    bottom: '-12px',
  },
});

const DottedLine = styled(Box)({
  position: 'absolute',
  top: '12px',
  bottom: '12px',
  left: '50%',
  width: '1px',
  transform: 'translateX(-50%)',
  background:
    'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 50%, transparent 50%)',
  backgroundSize: '1px 5px',
});

const TicketRight = styled(Box)(({ theme }) => ({
  width: '90px',
  padding: '24px 16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    width: '120px',
  },
}));

const VerticalPrice = styled(Typography)(({ theme }) => ({
  color: '#3ECF8E',
  fontSize: '15px',
  fontWeight: '500',
  writingMode: 'vertical-lr',
  transform: 'rotate(180deg)',
  textAlign: 'center',
  letterSpacing: '1px',
  whiteSpace: 'nowrap',
  paddingRight: '18px',
  [theme.breakpoints.up('md')]: {
    fontSize: '18px',
  },
  '& .currency': {
    fontSize: '12px',
    marginTop: '4px',
    [theme.breakpoints.up('md')]: {
      fontSize: '14px',
    },
  },
}));

const TicketIcon = styled(Box)(({ customGradient, theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: customGradient || 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  flexShrink: 0,
  [theme.breakpoints.up('md')]: {
    width: '48px',
    height: '48px',
  },
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '8px',
  '& .MuiIconButton-root': {
    padding: '4px',
    backgroundColor: 'rgba(0, 184, 148, 0.1)',
    color: '#3ECF8E',
    '&:hover': {
      backgroundColor: 'rgba(0, 184, 148, 0.2)',
    },
    [theme.breakpoints.up('md')]: {
      padding: '8px',
    },
  },
}));

const CompleteBadge = styled(Typography)(({ theme }) => ({
  color: '#00b7ff',
  fontSize: '14px',
  fontWeight: '500',
  marginTop: '8px',
  [theme.breakpoints.up('md')]: {
    fontSize: '16px',
  },
}));

const TotalSection = styled(Box)(({ visible, theme }) => ({
  position: 'fixed',
  bottom: visible ? 0 : '-100px',
  left: 0,
  right: 0,
  backgroundColor: '#242424',
  padding: '16px',
  borderRadius: '24px 24px 0 0',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '84px',
  [theme.breakpoints.up('md')]: {
    padding: '24px 48px',
    height: '100px',
  },
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const TotalInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const ContinueButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#3ECF8E',
  color: '#242424',
  borderRadius: '24px',
  padding: '8px 20px',
  textTransform: 'none',
  fontSize: '16px',
  width: 'auto',
  '&:hover': {
    backgroundColor: '#00a383',
  },
  [theme.breakpoints.up('md')]: {
    padding: '8px 24px',
    fontSize: '18px',
  },
}));

const CategoryBilletPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useEvent(id);

  const {
    data: ticketCategories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useEventTicketCategories(id);

  const [quantities, setQuantities] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (ticketCategories && Array.isArray(ticketCategories)) {
      const initialQuantities = ticketCategories.reduce((acc, category) => {
        if (category && category.id) {
          acc[category.id] = 0;
        }
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [ticketCategories]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalTickets = useMemo(() => {
    if (!quantities || typeof quantities !== 'object') return 0;
    return Object.values(quantities).reduce(
      (sum, quantity) => sum + (Number.isInteger(quantity) ? quantity : 0),
      0
    );
  }, [quantities]);

  const totalPrice = useMemo(() => {
    if (!ticketCategories || !Array.isArray(ticketCategories) || !quantities)
      return 0;

    return Object.entries(quantities).reduce((sum, [categoryId, quantity]) => {
      const category = ticketCategories.find((cat) => cat?.id === categoryId);
      if (
        !category ||
        !Number.isInteger(quantity) ||
        !Number.isFinite(category.price)
      ) {
        return sum;
      }
      return sum + quantity * category.price;
    }, 0);
  }, [quantities, ticketCategories]);

  const updateQuantity = useCallback(
    (categoryId, delta) => {
      if (!ticketCategories || !Array.isArray(ticketCategories)) return;

      const category = ticketCategories.find((cat) => cat?.id === categoryId);
      if (!category || !Number.isInteger(category.availableQuantity)) return;

      setQuantities((prev) => {
        const currentQuantity = prev[categoryId] || 0;
        const newQuantity = Math.max(
          0,
          Math.min(currentQuantity + delta, category.availableQuantity)
        );
        return {
          ...prev,
          [categoryId]: newQuantity,
        };
      });
    },
    [ticketCategories]
  );

  const getGradientByCategory = useCallback((categoryName) => {
    if (!categoryName || typeof categoryName !== 'string') return undefined;

    const upperCaseName = categoryName.toUpperCase();
    if (upperCaseName.includes('VIP') || upperCaseName === 'VVIP') {
      return 'linear-gradient(45deg, #4A0E4E, #81267D)';
    }
    if (upperCaseName.includes('CARRÉ OR')) {
      return 'linear-gradient(225deg, #FFD700, #FFA500)';
    }
    return undefined;
  }, []);

  const formatEventDate = useCallback((dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) throw new Error('Invalid date');
      return format(date, 'EEE, d MMMM', { locale: fr });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date invalide';
    }
  }, []);

  const formatEventTime = useCallback((dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) throw new Error('Invalid date');
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Time formatting error:', error);
      return '--:--';
    }
  }, []);

  const renderTicket = useCallback(
    (category) => {
      if (!category || !category.id) return null;

      const isComplete = category.availableQuantity === 0;
      const gradientBackground = getGradientByCategory(category.name);

      return (
        <Grid item xs={12} md={6} lg={6} key={category.id}>
          <TicketCard isComplete={isComplete}>
            <TicketLeft>
              <TicketIcon customGradient={gradientBackground}>
                <ConfirmationNumberIcon
                  sx={{ fontSize: { xs: '24px', md: '28px' }, color: 'white' }}
                />
              </TicketIcon>
              <TicketContent>
                <Typography
                  sx={{
                    fontSize: { xs: '16px', md: '20px' },
                    fontWeight: '500',
                  }}
                >
                  {category.name || 'Sans nom'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Entrée {category.name || 'Standard'}
                </Typography>
                {isComplete ? (
                  <CompleteBadge>Complet</CompleteBadge>
                ) : (
                  <QuantityControl>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(category.id, -1)}
                      disabled={!quantities[category.id]}
                    >
                      <RemoveIcon
                        sx={{ fontSize: { xs: '16px', md: '20px' } }}
                      />
                    </IconButton>
                    <Typography
                      sx={{
                        fontSize: { xs: '15px', md: '18px' },
                        minWidth: '20px',
                        textAlign: 'center',
                      }}
                    >
                      {quantities[category.id] || 0}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(category.id, 1)}
                      disabled={
                        quantities[category.id] >= category.availableQuantity
                      }
                    >
                      <AddIcon sx={{ fontSize: { xs: '16px', md: '20px' } }} />
                    </IconButton>
                  </QuantityControl>
                )}
              </TicketContent>
            </TicketLeft>
            <TicketDividerContainer>
              <DottedLine />
            </TicketDividerContainer>
            <TicketRight>
              <VerticalPrice>
                {(category.price || 0).toLocaleString()}{' '}
                <span className="currency">XAF</span>
              </VerticalPrice>
            </TicketRight>
          </TicketCard>
        </Grid>
      );
    },
    [quantities, updateQuantity, getGradientByCategory]
  );

  useEffect(() => {
    if (eventError || categoriesError) {
      setError(eventError || categoriesError);
    }
  }, [eventError, categoriesError]);

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Une erreur est survenue: {error.message}
      </Alert>
    );
  }

  if (isEventLoading || isCategoriesLoading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (!event || !ticketCategories) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Aucune information disponible
      </Alert>
    );
  }

  const startDate = event.startDate ? parseISO(event.startDate) : null;
  const endDate = event.endDate ? parseISO(event.endDate) : null;

  return (
    <PageContainer>
      <StyledAppBar scrolled={scrolled}>
        <StyledToolbar>
          <IconButton
            edge="start"
            sx={{ color: 'white', marginRight: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <HeaderTitle>Réserver vos epass</HeaderTitle>
        </StyledToolbar>
      </StyledAppBar>

      <ContentContainer>
        <EventContainer>
          <EventImage>
            <img
              src={event.coverImage || '/placeholder-image.jpg'}
              alt={event.name || 'Événement'}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </EventImage>
          <EventInfo>
            <EventTitle>{event.name || 'Événement sans nom'}</EventTitle>
            {startDate && (
              <EventDetail>
                <CalendarTodayIcon
                  sx={{ fontSize: { xs: '16px', md: '20px' } }}
                />
                {formatEventDate(event.startDate)}
              </EventDetail>
            )}
            {startDate && (
              <EventDetail>
                <AccessTimeIcon sx={{ fontSize: { xs: '16px', md: '20px' } }} />
                {formatEventTime(event.startDate)}
                {endDate && ` - ${formatEventTime(event.endDate)}`}
              </EventDetail>
            )}
            {event.location && (
              <EventDetail>
                <LocationOnIcon sx={{ fontSize: { xs: '16px', md: '20px' } }} />
                {event.location.name || 'Lieu non spécifié'}
                {event.location.city && `, ${event.location.city}`}
              </EventDetail>
            )}
          </EventInfo>
        </EventContainer>

        <Typography
          sx={{
            px: { xs: 2, md: 4 },
            mb: { xs: 2, md: 3 },
            fontSize: { xs: '18px', md: '24px' },
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          Sélectionnez vos epass
        </Typography>

        <TicketsGrid container spacing={{ xs: 2, md: 3 }}>
          {Array.isArray(ticketCategories) &&
            ticketCategories.map(renderTicket)}
        </TicketsGrid>

        {openModal && (
          <PurchaseSummaryModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            event={event}
            tickets={ticketCategories}
            quantities={quantities}
            totalPrice={totalPrice}
          />
        )}

        <TotalSection visible={totalTickets > 0}>
          <TotalInfo>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '12px', md: '16px' },
              }}
            >
              Nombre d'e-pass: {totalTickets}
            </Typography>
            <Typography
              sx={{
                fontWeight: '500',
                fontSize: { xs: '16px', md: '24px' },
              }}
            >
              Total:{' '}
              <span
                style={{
                  color: '#3ECF8E',
                  fontFamily: 'Montserrat',
                  fontWeight: '510',
                }}
              >
                {totalPrice.toLocaleString()} XAF
              </span>
            </Typography>
          </TotalInfo>
          <ContinueButton
            onClick={() => setOpenModal(true)}
            variant="contained"
            size="large"
          >
            Continuer
          </ContinueButton>
        </TotalSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default CategoryBilletPage;
