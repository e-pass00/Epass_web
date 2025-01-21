import { useState, useMemo, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import {
  SearchIcon,
  BellIcon,
  User,
  LogOut,
  LogIn,
  LogOutIcon,
} from 'lucide-react';
import SearchBar from './SearchBar';
import EventCategories from './EventCategories';
import { useLocation, useNavigate } from 'react-router-dom';
import useSearchStore from '../features/events/stores/useSearchStore';
import useNotificationStore from '../features/events/stores/useNotificationStore';
import {
  useUserNotifications,
  useUserInfo,
} from '../features/events/api/queries';
import SearchModal from './SearchModal';
import NotificationModal from './NotificationModal';
import logo from '../assets/logo_epass.svg';
import useAuthStore from '../features/auth/stores/authStore';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#131313',
  borderBottom: 'solid 1px #292828',
  '@media (max-width: 768px)': {
    display: 'none',
  },
}));

const MainRouteAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#131313',
  borderBottom: 'solid 1px #292828',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#3ECF8E',
    color: '#F1F1F1',
    fontWeight: '400',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme, isMobile }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#F1F1F1',
  marginLeft: '16px',
  fontWeight: isMobile ? 'normal' : 'bold',
  fontSize: isMobile ? '0.9rem' : '1rem',
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#383838',
    borderRadius: '12px',
    border: '1px solid #292828',
    width: '180px',
    overflow: 'visible',
    marginTop: '8px',
    '& .MuiList-root': {
      padding: '8px',
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: -6,
      right: 24,
      width: 12,
      height: 12,
      backgroundColor: '#383838',
      transform: 'rotate(45deg)',
      zIndex: 0,
    },
  },
  '& .MuiMenuItem-root': {
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#F1F1F1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: 'transparent',
      '& .icon': {
        color: '#3ECF8E',
      },
      '& .text': {
        color: '#3ECF8E',
      },
    },

    '& .icon': {
      color: theme.palette.primary.main,
      transition: 'color 0.2s ease',
    },

    '& .text': {
      transition: 'color 0.2s ease',
    },
  },
}));

const Header = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { openSearchModal } = useSearchStore();
  const isMainRoute = location.pathname === '/';

  // Auth store
  const { isAuthenticated, logout, openModal } = useAuthStore();

  // Récupération des informations de l'utilisateur
  const { data: userData } = useUserInfo();

  const { data: notifications, isLoading: isLoadingNotifications } =
    useUserNotifications();
  const { unreadCount, setUnreadCount, setNotifications } =
    useNotificationStore();

  useEffect(() => {
    if (notifications) {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read
      );
      setUnreadCount(unreadNotifications.length);
      setNotifications(notifications);
    }
  }, [notifications, setUnreadCount, setNotifications]);

  // Fonction pour obtenir l'initiale de l'utilisateur
  const getUserInitial = () => {
    if (!userData || !userData.username) return '?';
    return userData.username.charAt(0).toUpperCase();
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleNotificationClick = () => {
    setNotificationModalOpen(true);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    if (isAuthenticated()) {
      navigate('/profile');
    } else {
      openModal('/profile'); // Le modal s'ouvre avec la redirection vers /profile après connexion
    }
  };

  const handleAuthAction = async () => {
    handleMenuClose();
    if (isAuthenticated()) {
      try {
        await logout();
        // Ouvrir le modal de connexion immédiatement après la déconnexion
        openModal();
        navigate('/');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    } else {
      openModal();
    }
  };

  const menuItems = useMemo(
    () => [
      {
        label: 'Profile',
        icon: <User size={18} className="icon" />,
        onClick: handleProfileClick,
      },
      {
        label: isAuthenticated() ? 'Déconnexion' : 'Connexion',
        icon: isAuthenticated() ? (
          <LogOutIcon size={18} className="icon" />
        ) : (
          <LogIn size={18} className="icon" />
        ),
        onClick: handleAuthAction,
      },
    ],
    [isAuthenticated()]
  );

  const iconStyle = { fontSize: isMobile ? 22 : 24 };
  const AppBarComponent = isMainRoute ? MainRouteAppBar : StyledAppBar;

  const headerContent = (
    <>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            sx={{
              width: isMobile ? '50px' : '56px',
              height: 'auto',
              marginRight: -0.5,
              marginLeft: -1,
              filter:
                'brightness(0) saturate(100%) invert(80%) sepia(29%) saturate(1115%) hue-rotate(101deg) brightness(99%) contrast(87%)',
            }}
            src={logo}
            alt="Logo"
          />

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              background: 'linear-gradient(45deg, #F1F1F1 30%, #3ECF8E 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Epass
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="search"
              onClick={openSearchModal}
            >
              <SearchIcon size={22} />
            </IconButton>
          )}
          {isAuthenticated() && (
            <IconButton
              color="inherit"
              aria-label="notifications"
              sx={{ marginLeft: '10px' }}
              onClick={handleNotificationClick}
              disabled={isLoadingNotifications}
            >
              <StyledBadge
                badgeContent={unreadCount}
                max={99}
                invisible={unreadCount === 0}
              >
                <BellIcon size={22} />
              </StyledBadge>
            </IconButton>
          )}
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            aria-controls={Boolean(menuAnchor) ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(menuAnchor) ? 'true' : undefined}
          >
            <StyledAvatar
              sx={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
              }}
              isMobile={isMobile}
            >
              {isAuthenticated() ? getUserInitial() : '?'}
            </StyledAvatar>
            {!isMobile && <KeyboardArrowDownOutlinedIcon sx={iconStyle} />}
          </IconButton>
        </Box>
      </Toolbar>

      {!isMobile && <SearchBar />}
      <EventCategories />

      {menuAnchor && (
        <StyledMenu
          id="account-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          keepMounted={false}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index} onClick={item.onClick}>
              {item.icon}
              <Typography className="text">{item.label}</Typography>
            </MenuItem>
          ))}
        </StyledMenu>
      )}
    </>
  );

  return (
    <>
      <AppBarComponent position="fixed" sx={{ right: 0 }}>
        {headerContent}
      </AppBarComponent>
      <SearchModal />
      <NotificationModal
        open={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
    </>
  );
};

export default Header;
