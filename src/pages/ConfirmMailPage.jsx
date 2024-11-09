import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Styled components restent les mêmes...
const StyledContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
`;

const StyledButton = styled(Button)`
  margin-top: 2rem;
  background: linear-gradient(45deg, #3ecf8e 30%, #64d2ff 90%);
  box-shadow: 0 3px 5px 2px rgba(62, 207, 142, 0.3);
  border-radius: 25px;
  padding: 12px 32px;

  &:hover {
    background: linear-gradient(45deg, #2ebf7e 30%, #54c2ef 90%);
  }
`;

const Logo = ({ isMobile }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box
      component="img"
      sx={{
        width: isMobile ? '36px' : '40px',
        height: 'auto',
        marginRight: 1,
        filter:
          'brightness(0) saturate(100%) invert(80%) sepia(29%) saturate(1115%) hue-rotate(101deg) brightness(99%) contrast(87%)',
      }}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHklEQVR4nO1bTW4TMRR+7QYo52gvQ4ELJDlDf0AIJPS96Qqp6qIrFFDZoHKJbHsLCkeg3CDIMxNiZzKO59nOTFx/kjdJZuz3zXvO5/lsolVcXj6nonhNwBkxv7O0twQcUd9QY1BjsY/1lIBXBBzYbrVXB/WXmOdODbinvsH8y3m8zA/EfF7GagDYJ+BHhxvtKgGLdmuSwGUKmYExTwn41NqYP9LFxSH1DTUGNRb7WKd1THqMZ8uaN9P+K11fP6HUoGJivjHKAWpOUJPD8sOfSQZvkrAsGeBYEfBGI+AzpQ5VDkYZAKx9wJQ6GvEiE8A5A9ihBJRWYB5vUFx6G5fXuKXl4t7Na0L3Ky4BYCIQHGNHAiat14Tu14MAFihFt0nVNobQ/QYhALizKK+7aASE6HcNAR809t6LBin5nYwA/34b8QJHpU5Wzabt0yHALd5kCRADmQDOGcC5BOY1CTOLEptZ6rlN1c0cdYCs3+BzAAsFiYuqiy2ExODyyXUdyKhzMKvXhOg3CFC+OB1Z372ZbbRmYbNJ1a27xr/fwQCPbOndQCYAOQPItQTsltcwbLmoGbDJ8RmCK9UrAaptFWiouM1p2Exjd7XWZnn1SMCkcxranqL0b7A3AniNIvMjQKbWei0BaIrMxR1ud27las0k0u91/E4i5Ov4wcBmjEj+HaIshmLCZox03xAx4MVQG7JERl4j0OCXyYjqDtt8gXj9dkJcd9hGQLx+OyEVd1gMJOIOByKAvX/3KL1BeBojCRAw6Vy/iRHAnXV8dAJQbhj4XS4yYm+QkBkjMTZIaPFii1tkQk+QgbbIcOcO5O6wHwEh3OHGGLDFbXL+BPgLITEBHMCl1e/h+tIitDvskQH7AdzhxT3cX1qEdofFBKSCTAByBpCR8czn2gQypdQBfNHiPSUqipcaI/dJH5oCntYqsIq3KF6oDw/qE5ULVm6SJKEK/pv2sP/Q1dWz6kuzDOa1+TBN5uywSnv9yVcEnKyeG74VCI5dPTr7vXl+mGivPjH+kCwBKu2rJ98Inv5DzQnVxKiOnKdydljFcrys+SX+AXTCbU7GY3MmAAAAAElFTkSuQmCC"
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
);

const ConfirmMailPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Réinitialiser le flag à chaque changement de route
    hasRefreshed.current = false;

    // Vérifier si on doit recharger la page
    const shouldReload =
      !hasRefreshed.current && !location.search.includes('reloaded=true');

    if (shouldReload) {
      hasRefreshed.current = true;
      // Ajouter un paramètre à l'URL pour éviter la boucle infinie
      window.location.href = `${location.pathname}?reloaded=true`;
      return;
    }

    // Gérer l'animation une fois que la page est chargée
    setIsVisible(false);
    const animationFrame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [location]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.4,
        ease: 'easeIn',
      },
    },
  };

  return (
    <StyledContainer maxWidth="sm">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={location.key || 'confirm-mail'}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <StyledPaper elevation={3}>
              <Logo isMobile={isMobile} />

              <Box sx={{ mt: 4 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{
                      fontSize: 80,
                      color: '#3ECF8E',
                      mb: 2,
                    }}
                  />
                </motion.div>

                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Vérifiez votre boîte mail
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ maxWidth: 400, mx: 'auto' }}
                >
                  Nous vous avons envoyé un email de confirmation. Cliquez sur
                  le lien dans l'email pour activer votre compte.
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Vous n'avez pas reçu l'email ?
                </Typography>

                <StyledButton
                  variant="contained"
                  disableElevation
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Renvoyer l'email
                </StyledButton>
              </Box>
            </StyledPaper>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledContainer>
  );
};

export default ConfirmMailPage;
