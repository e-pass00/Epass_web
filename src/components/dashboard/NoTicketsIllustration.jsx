// NoTicketsIllustration.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CancelIcon from '@mui/icons-material/Cancel';
import styled, { keyframes } from 'styled-components';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.7; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`;

// Styled Components
const CircleContainer = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  animation: ${pulse} 3s infinite ease-in-out;
`;

const Circle = styled(Box)`
  position: absolute;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 50%;

  &.large {
    top: -64px;
    left: -64px;
    right: -64px;
    bottom: -64px;
  }

  &.medium {
    top: -48px;
    left: -48px;
    right: -48px;
    bottom: -48px;
  }

  &.small {
    top: -32px;
    left: -32px;
    right: -32px;
    bottom: -32px;
  }
`;

const TicketIconWrapper = styled(Box)`
  position: relative;
  animation: ${bounce} 2s infinite ease-in-out;
`;

const Star = styled(Box)`
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: ${twinkle} 3s infinite ease-in-out;
`;

const NoTicketsIllustration = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Cercles décoratifs */}
      <CircleContainer>
        <Circle className="large" />
        <Circle className="medium" />
        <Circle className="small" />
      </CircleContainer>

      {/* Contenu central */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <TicketIconWrapper>
          <ConfirmationNumberIcon
            sx={{
              fontSize: 64,
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          />
          <CancelIcon
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          />
        </TicketIconWrapper>

        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            mt: 2,
            fontWeight: 600,
          }}
        >
          Aucun billet vendu
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            mt: 1,
          }}
        >
          Les ventes commenceront bientôt !
        </Typography>
      </Box>

      {/* Étoiles */}
      {[...Array(6)].map((_, index) => (
        <Star
          key={index}
          sx={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </Box>
  );
};

export default NoTicketsIllustration;
