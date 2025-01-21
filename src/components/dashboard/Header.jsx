import { styled, Box, Typography, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import logo from '../../assets/logo_epass.svg';

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  [theme.breakpoints.down('sm')]: {
    gap: '6px',
  },
}));

const LogoImage = styled('img')(({ theme }) => ({
  width: '45px',
  height: '45px',
  filter:
    'brightness(0) saturate(100%) invert(80%) sepia(29%) saturate(1115%) hue-rotate(101deg) brightness(99%) contrast(87%)',
  [theme.breakpoints.down('sm')]: {
    width: '38px',
    height: '38px',
  },
}));

const AppName = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '22px',
  color: theme.palette.text.primary,
  background: 'linear-gradient(45deg, #F1F1F1 30%, #3ECF8E 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
}));

const IconsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.5),
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
  },
}));

const Header = () => (
  <HeaderContainer>
    <LogoContainer>
      <LogoImage src={logo} alt="Logo" />
      <AppName>E-pass Dashboard</AppName>
    </LogoContainer>
    <IconsContainer>
      <StyledIconButton>
        <EditIcon sx={{ fontSize: { xs: '18px', sm: '22px' } }} />
      </StyledIconButton>
      <StyledIconButton>
        <NotificationsIcon sx={{ fontSize: { xs: '18px', sm: '22px' } }} />
      </StyledIconButton>
      <StyledAvatar src="/path-to-avatar.jpg" />
    </IconsContainer>
  </HeaderContainer>
);

export default Header;
