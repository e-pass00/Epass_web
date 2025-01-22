import { styled, Box, Typography, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

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

const LeftContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  [theme.breakpoints.down('sm')]: {
    gap: '6px',
  },
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  marginRight: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5),
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

const Header = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Retourne à la page précédente
  };

  return (
    <HeaderContainer>
      <LeftContainer>
        <BackButton onClick={handleBack}>
          <ArrowBackIcon sx={{ fontSize: { xs: '20px', sm: '24px' } }} />
        </BackButton>
        <AppName>E-pass Dashboard</AppName>
      </LeftContainer>
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
};

export default Header;
