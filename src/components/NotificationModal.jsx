import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Typography,
  Box,
  IconButton,
  Badge,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Ticket,
  AlertTriangle,
  Info,
  CreditCard,
  Circle,
  X as CloseIcon,
  Inbox,
} from 'lucide-react';
import { useUserNotifications } from '../features/events/api/queries';

// Styled Components restent les mêmes
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#131313',
    maxWidth: 500,
    width: '100%',
    margin: useMediaQuery(theme.breakpoints.down('sm')) ? '0' : '32px',
    height: useMediaQuery(theme.breakpoints.down('sm')) ? '100%' : '80vh',
    maxHeight: useMediaQuery(theme.breakpoints.down('sm')) ? '100%' : '80vh',
  },
}));

const StyledDialogContent = styled(DialogContent)({
  padding: 0,
  backgroundColor: '#131313',
  '&.MuiDialogContent-root': {
    padding: 0,
  },
});

const StyledTab = styled(Tab)(({ theme }) => ({
  color: '#F1F1F1',
  '&.Mui-selected': {
    color: '#3ECF8E',
  },
  minHeight: 'auto',
  padding: '12px',
}));

const NotificationItem = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  padding: '16px',
  borderBottom: '1px solid #292828',
  backgroundColor: '#131313',
  '&:hover': {
    backgroundColor: '#1A1A1A',
  },
});

const IconWrapper = styled(Box)({
  marginRight: '16px',
  marginTop: '4px',
});

const StyledBadge = styled(Badge)(({ color }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: color,
    color: '#F1F1F1',
  },
}));

const ScrollableContent = styled(Box)({
  height: '100%',
  overflowY: 'auto',
  backgroundColor: '#131313',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#131313',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#3ECF8E',
    borderRadius: '3px',
  },
});

const StyledAppBar = styled(AppBar)({
  position: 'relative',
  backgroundColor: '#131313',
  boxShadow: 'none',
  borderBottom: '1px solid #292828',
});

const NotificationModal = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: notifications, isLoading, error } = useUserNotifications();

  const tabConfig = [
    {
      label: 'Billets',
      icon: <Ticket size={20} />,
      color: '#FFB020',
      key: 'billet',
    },
    {
      label: 'Alertes',
      icon: <AlertTriangle size={20} />,
      color: '#D14343',
      key: 'alert',
    },
    {
      label: 'Infos',
      icon: <Info size={20} />,
      color: '#2196F3',
      key: 'info',
    },
    {
      label: 'Paiements',
      icon: <CreditCard size={20} />,
      color: '#3ECF8E',
      key: 'payment',
    },
  ];

  const formatDate = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Organiser les notifications par type
  const organizedNotifications =
    notifications?.reduce((acc, notification) => {
      if (!acc[notification.type]) {
        acc[notification.type] = [];
      }
      acc[notification.type].push(notification);
      return acc;
    }, {}) || {};

  // Vérifier s'il y a des notifications non lues pour chaque type
  const hasUnreadNotifications = (type) => {
    return organizedNotifications[type]?.some((n) => !n.read) || false;
  };

  if (isLoading) {
    return (
      <StyledDialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <Box sx={{ p: 3, textAlign: 'center', color: '#F1F1F1' }}>
          Chargement...
        </Box>
      </StyledDialog>
    );
  }

  if (error) {
    return (
      <StyledDialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <Box sx={{ p: 3, textAlign: 'center', color: '#F1F1F1' }}>
          Une erreur est survenue: {error.message}
        </Box>
      </StyledDialog>
    );
  }

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <StyledAppBar>
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <Typography variant="h6" sx={{ color: '#F1F1F1', flex: 1 }}>
            Notifications
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>

      <StyledDialogContent>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#131313',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: '#292828',
              backgroundColor: '#131313',
            }}
          >
            {tabConfig.map((tab, index) => (
              <StyledTab
                key={index}
                icon={
                  <StyledBadge
                    color={tab.color}
                    variant="dot"
                    invisible={!hasUnreadNotifications(tab.key)}
                  >
                    {tab.icon}
                  </StyledBadge>
                }
                label={tab.label}
              />
            ))}
          </Tabs>

          <ScrollableContent>
            {tabConfig.map(
              (tab, typeIndex) =>
                currentTab === typeIndex && (
                  <Box key={tab.key}>
                    {!organizedNotifications[tab.key]?.length ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 4,
                          color: '#666',
                          height: '400px',
                        }}
                      >
                        <Inbox size={48} style={{ marginBottom: '16px' }} />
                        <Typography
                          variant="h6"
                          sx={{ mb: 1, color: '#F1F1F1' }}
                        >
                          C'est calme par ici
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ textAlign: 'center' }}
                        >
                          Vous n'avez pas encore de {tab.label.toLowerCase()} à
                          consulter.
                        </Typography>
                      </Box>
                    ) : (
                      organizedNotifications[tab.key]?.map((notification) => (
                        <NotificationItem key={notification.id}>
                          <IconWrapper>{tab.icon}</IconWrapper>
                          <Box
                            sx={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                color: '#F1F1F1',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                mb: 0.5,
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: '#F1F1F1' }}
                            >
                              {notification.label}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ color: '#666' }}
                              >
                                {formatDate(notification.createdAt)}
                              </Typography>
                              {!notification.read && (
                                <Circle
                                  size={8}
                                  fill={tab.color}
                                  color={tab.color}
                                />
                              )}
                            </Box>
                          </Box>
                        </NotificationItem>
                      ))
                    )}
                  </Box>
                )
            )}
          </ScrollableContent>
        </Box>
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default NotificationModal;
