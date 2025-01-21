import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Modal,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import {
  AccessTime,
  Close,
  LocationOn,
  ReceiptLong,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import EPassModal from '../components/EPassModal';
import { useUserTickets } from '../features/events/api/queries';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledCard = styled(motion.div)(({ theme, type }) => {
  // Normaliser la catégorie en minuscules pour la comparaison
  const normalizedType = type?.toLowerCase();

  return {
    borderRadius: theme.spacing(2),
    cursor: 'pointer',
    position: 'relative',
    overflow: 'visible',
    height: '100%',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: '#131313',
      transform: 'translateY(-50%)',
      zIndex: 1,
    },
    '&::before': {
      left: '-10px',
    },
    '&::after': {
      right: '-10px',
    },
    ...(normalizedType === 'carré or' && {
      background: 'linear-gradient(225deg, #FFD700, #FFA500)',
    }),
    ...(normalizedType === 'vip' && {
      background: 'linear-gradient(45deg, #4A0E4E, #81267D)',
    }),
    ...(normalizedType === 'vvip' && {
      background: 'linear-gradient(45deg, #4A0E4E, #81267D)',
    }),
    ...(normalizedType === 'standard' && {
      background: 'rgba(255, 255, 255, 0.07)',
    }),
  };
});

const StickyHeader = styled(Box)(({ theme, scrolled }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: scrolled ? 'rgba(19, 19, 19, 0.95)' : '#131313',
  backdropFilter: scrolled ? 'blur(10px)' : 'none',
  zIndex: 1000,
  transition: 'background-color 0.3s ease',
  borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
}));

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: '300px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: theme.spacing(2),
  margin: theme.spacing(2),
}));

const DashedLine = styled(Box)({
  position: 'absolute',
  left: '10px',
  right: '10px',
  top: '50%',
  borderTop: '1px dashed rgba(255,255,255,0.3)',
});

const EventInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
});

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const ScannedBadge = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '0 8px 0 8px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const ErrorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  color: 'white',
  gap: '16px',
});

const EmptyState = ({ message, icon: Icon }) => (
  <EmptyStateContainer>
    <Icon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ color: 'white', textAlign: 'center', mb: 1 }}
    >
      {message}
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}
    >
      Revenez plus tard pour voir vos e-pass ici
    </Typography>
  </EmptyStateContainer>
);

const TicketsPage = () => {
  const theme = useTheme();
  const isAbove769 = useMediaQuery('(min-width:769px)');
  const isMediumScreen = useMediaQuery('(max-width:768px)');

  // Unified state object
  const [uiState, setUiState] = useState({
    scrolled: false,
    activeTab: 0,
    selectedTicket: null,
    openModal: false,
  });

  // Destructure state for easier access
  const { scrolled, activeTab, selectedTicket, openModal } = uiState;

  // Query hook
  const { data: ticketsData, isLoading, error } = useUserTickets();

  // Event handlers
  const handleScroll = () => {
    const isScrolled = window.scrollY > 10;
    setUiState((prev) => ({ ...prev, scrolled: isScrolled }));
  };

  const handleTabChange = (event, newValue) => {
    setUiState((prev) => ({ ...prev, activeTab: newValue }));
  };

  const handleOpenModal = (ticket) => {
    setUiState((prev) => ({
      ...prev,
      selectedTicket: ticket,
      openModal: true,
    }));
  };

  const handleCloseModal = () => {
    setUiState((prev) => ({
      ...prev,
      selectedTicket: null,
      openModal: false,
    }));
  };

  // Effects
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helpers
  const formatTime = (dateString) => {
    return format(new Date(dateString), 'HH:mm', { locale: fr });
  };

  // Computed values
  const hasUpcomingTickets = ticketsData?.upcoming?.length > 0;
  const hasHistoryTickets = ticketsData?.history?.length > 0;
  const hasNoTickets = !hasUpcomingTickets && !hasHistoryTickets;
  const displayedTickets =
    activeTab === 0 ? ticketsData?.upcoming : ticketsData?.history;

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ReceiptLong sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.5)' }} />
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Une erreur est survenue
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}
        >
          {error.message}
        </Typography>
      </ErrorContainer>
    );
  }

  return (
    <Box sx={{ bgcolor: '#131313', minHeight: '100vh', color: 'text.primary' }}>
      <StickyHeader scrolled={scrolled}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: '23px',
            color: '#ffff',
            paddingLeft: { md: '5%', xs: '5%' },
            marginTop: isAbove769 ? '50px' : '0',
            paddingTop: '20px',
            paddingBottom: '10px',
          }}
        >
          VOS e-pass
        </Typography>

        <Box sx={{ px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            TabIndicatorProps={{ sx: { backgroundColor: 'primary.main' } }}
          >
            <Tab
              label={`À venir (${ticketsData?.upcoming?.length || 0})`}
              sx={{
                color: activeTab === 0 ? 'white' : 'rgba(255,255,255,0.5)',
                textTransform: 'none',
              }}
            />
            <Tab
              label={`Historique (${ticketsData?.history?.length || 0})`}
              sx={{
                color: activeTab === 1 ? 'white' : 'rgba(255,255,255,0.5)',
                textTransform: 'none',
              }}
            />
          </Tabs>
        </Box>
      </StickyHeader>

      <Box sx={{ p: 2, mt: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {hasNoTickets ? (
              <EmptyState
                message="Vous n'avez pas encore de e-pass"
                icon={ReceiptLong}
              />
            ) : displayedTickets?.length === 0 ? (
              <EmptyState
                message={
                  activeTab === 0
                    ? "Vous n'avez pas de e-pass à venir"
                    : "Vous n'avez pas encore d'historique de e-pass"
                }
                icon={ReceiptLong}
              />
            ) : (
              <Grid container spacing={2}>
                {displayedTickets?.map((ticket) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.billetId}>
                    <StyledCard
                      type={ticket.categoryBillet}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenModal(ticket)}
                    >
                      {ticket.status === 'scanned' && (
                        <ScannedBadge>Scanné</ScannedBadge>
                      )}
                      <DashedLine />
                      <CardContent
                        sx={{
                          p: 2,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            height: '50%',
                          }}
                        >
                          <Avatar
                            src={ticket.coverImage}
                            sx={{
                              width: 60,
                              height: 60,
                              mr: 2,
                              borderRadius: '12px',
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{ color: 'white', fontWeight: 'bold' }}
                          >
                            {ticket.eventName}
                          </Typography>
                        </Box>
                        <EventInfo>
                          <Box sx={{ position: 'relative', top: '30px' }}>
                            <InfoItem>
                              <AccessTime
                                sx={{ color: 'white', mr: 1, fontSize: 16 }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: 'white' }}
                              >
                                {formatTime(ticket.startDate)}
                              </Typography>
                            </InfoItem>
                            <InfoItem>
                              <LocationOn
                                sx={{ color: 'white', mr: 1, fontSize: 16 }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: 'white', marginRight: '62px' }}
                              >
                                {ticket.locationName}
                              </Typography>
                            </InfoItem>
                          </Box>
                          <Chip
                            label={ticket.categoryBillet}
                            size="small"
                            sx={{
                              bgcolor:
                                ticket.categoryBillet?.toLowerCase() ===
                                'carré or'
                                  ? 'rgba(255, 215, 0, 1)'
                                  : ticket.categoryBillet?.toLowerCase() ===
                                      'vip'
                                    ? 'rgba(0, 0, 0, 0.5)'
                                    : ticket.categoryBillet?.toLowerCase() ===
                                        'vvip'
                                      ? 'rgba(129, 38, 125, 1)'
                                      : 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 'bold',
                              alignSelf: 'flex-end',
                              mt: 1,
                            }}
                          />
                        </EventInfo>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="ticket-details-modal"
        aria-describedby="details-of-the-selected-ticket"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: '#131313',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
            color: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography id="ticket-details-modal" variant="h6">
              Détails du ticket
            </Typography>
            <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
          {selectedTicket && (
            <EPassModal
              tickets={selectedTicket}
              open={openModal}
              onClose={handleCloseModal}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TicketsPage;
