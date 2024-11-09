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
import { SearchIcon, BellIcon } from 'lucide-react';
import SearchBar from './SearchBar';
import EventCategories from './EventCategories';
import { useLocation } from 'react-router-dom';
import useSearchStore from '../features/events/stores/useSearchStore';
import useNotificationStore from '../features/events/stores/useNotificationStore';
import { useUserNotifications } from '../features/events/api/queries';
import SearchModal from './SearchModal';
import NotificationModal from './NotificationModal';
import logo from '../assets/logo_epass.svg';

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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const { openSearchModal } = useSearchStore();
  const isMainRoute = location.pathname === '/';

  // Notification handling
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

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = () => {
    setNotificationModalOpen(true);
  };

  const menuItems = useMemo(
    () => [
      { label: 'Profile', icon: <Avatar /> },
      { label: 'My account', icon: <Avatar /> },
      { label: 'Logout', icon: <Avatar /> },
    ],
    []
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
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls="account-menu"
            aria-haspopup="true"
          >
            <StyledAvatar
              sx={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
              }}
              isMobile={isMobile}
            >
              M
            </StyledAvatar>
            {!isMobile && <KeyboardArrowDownOutlinedIcon sx={iconStyle} />}
          </IconButton>
        </Box>
      </Toolbar>

      {!isMobile && <SearchBar />}
      <EventCategories />

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={handleClose}>
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  return (
    <>
      <AppBarComponent position="fixed">{headerContent}</AppBarComponent>
      <SearchModal />
      <NotificationModal
        open={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
    </>
  );
};

export default Header;
