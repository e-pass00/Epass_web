import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

// Animations keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const NotFoundContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const ParticleContainer = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
});

const Particle = styled(Box)(({ index }) => ({
  position: 'absolute',
  width: '4px',
  height: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animation: `${float} ${2 + Math.random() * 3}s infinite ease-in-out ${Math.random() * 2}s`,
}));

const ErrorNumber = styled(Typography)(({ theme }) => ({
  fontSize: '180px',
  fontWeight: 900,
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  animation: `${pulse} 2s infinite ease-in-out`,
  textShadow: '0 0 20px rgba(255,255,255,0.1)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '120px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '12px 30px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  },
}));

const CircularDecoration = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '300px',
  height: '300px',
  border: '2px solid rgba(255,255,255,0.1)',
  borderRadius: '50%',
  animation: `${rotate} 20s linear infinite`,
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    border: '2px solid transparent',
    borderRadius: '50%',
    borderTopColor: theme.palette.primary.main,
  },
}));

const NotFoundPage = () => {
  const navigate = useNavigate();
  const particles = Array.from({ length: 50 }, (_, i) => (
    <Particle key={i} index={i} />
  ));

  return (
    <NotFoundContainer>
      {/* Particles Background */}
      <ParticleContainer>{particles}</ParticleContainer>

      {/* Decorative Circles */}
      <CircularDecoration sx={{ transform: 'scale(1.5)' }} />
      <CircularDecoration sx={{ transform: 'scale(1.2)' }} />
      <CircularDecoration />

      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
      >
        <ErrorNumber variant="h1">404</ErrorNumber>

        <Typography
          variant="h4"
          sx={{
            color: 'white',
            mb: 3,
            fontWeight: 'bold',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          Page introuvable
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          La page que vous recherchez semble avoir disparu dans le cyberespace.
          Pas d'inquiétude, vous pouvez toujours retourner à la civilisation !
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <StyledButton
            variant="contained"
            color="primary"
            startIcon={<Home />}
            onClick={() => navigate('/')}
          >
            Accueil
          </StyledButton>

          <StyledButton
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Retour
          </StyledButton>
        </Box>
      </Container>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
