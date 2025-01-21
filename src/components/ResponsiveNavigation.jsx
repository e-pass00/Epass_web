/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home,
  Favorite,
  ConfirmationNumber,
  Person,
} from '@mui/icons-material';
import { styled } from '@mui/system';

const HEADER_HEIGHT = 110;
const BOTTOM_BAR_HEIGHT = 56;

const StyledSidebar = styled(List)(({ theme }) => ({
  backgroundColor: '#131313',
  zIndex: theme.zIndex.appBar,
  width: '70px',
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  position: 'fixed',
  left: 0,
  top: HEADER_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid rgba(255, 255, 255, 0.12)',
  padding: '30px 0',
}));

const StyledBottomBar = styled(BottomNavigation)(({ theme }) => ({
  backgroundColor: '#131313',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: '100',
  height: BOTTOM_BAR_HEIGHT,
  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: '8px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100px',
  transition: 'background-color 0.3s ease',
  [theme.breakpoints.up('md')]: {
    cursor: 'pointer',
  },

  '&.Mui-selected': {
    backgroundColor: 'transparent',
  },
}));
const StyledListItemIcon = styled(ListItemIcon)(({ selected }) => ({
  minWidth: 'auto',
  color: selected ? '#3ECF8E' : '#ffffff',
  justifyContent: 'center',
  transition: 'color 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const StyledListItemText = styled(ListItemText)(({ selected }) => ({
  margin: '4px 0 0 0',
  '& .MuiListItemText-primary': {
    color: selected ? '#3ECF8E' : '#ffffff',
    fontSize: selected ? '0.75rem' : '0.65rem',
    textAlign: 'center',
    transition: 'color 0.3s ease, font-size 0.3s ease',
  },
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)(
  ({ theme }) => ({
    color: '#ffffff',
    '&.Mui-selected': {
      color: '#3ECF8E',
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.75rem',
    },
  })
);

const ResponsiveNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (isMediumScreen) {
      document.body.style.marginLeft = '70px';
      document.body.style.marginBottom = '0px';
    } else {
      document.body.style.marginLeft = '0px';
      document.body.style.marginBottom = `${BOTTOM_BAR_HEIGHT}px`;
    }

    return () => {
      document.body.style.marginLeft = '0px';
      document.body.style.marginBottom = '0px';
    };
  }, [isMediumScreen]);

  useEffect(() => {
    const pathToIndex = {
      '/': 0,
      '/favorites': 1,
      '/tickets': 2,
      '/profile': 3,
    };
    setValue(pathToIndex[location.pathname] || 0);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const paths = ['/', '/favorites', '/tickets', '/profile'];
    navigate(paths[newValue]);
  };

  const menuItems = [
    { label: 'Accueil', icon: <Home />, path: '/' },
    { label: 'Favoris', icon: <Favorite />, path: '/favorites' },
    { label: 'Tickets', icon: <ConfirmationNumber />, path: '/tickets' },
    { label: 'Profil', icon: <Person />, path: '/profile' },
  ];

  if (isMediumScreen) {
    return (
      <StyledSidebar>
        {menuItems.map((item, index) => (
          <StyledListItem
            key={item.label}
            selected={value === index}
            onClick={(event) => handleChange(event, index)}
          >
            <StyledListItemIcon selected={value === index}>
              {item.icon}
            </StyledListItemIcon>
            <StyledListItemText
              primary={item.label}
              selected={value === index}
            />
          </StyledListItem>
        ))}
      </StyledSidebar>
    );
  }

  return (
    <StyledBottomBar value={value} onChange={handleChange} showLabels>
      {menuItems.map((item, index) => (
        <StyledBottomNavigationAction
          key={item.label}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </StyledBottomBar>
  );
};

export default ResponsiveNavigation;
