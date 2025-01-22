import React from 'react';
import { Box, Typography } from '@mui/material';
import { TimelineOutlined } from '@mui/icons-material';
import styled, { keyframes } from 'styled-components';

// Animations
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const dots = keyframes`
  0%, 20% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  80%, 100% {
    transform: translateY(0);
  }
`;

// Styled Components
const EmptyStateContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px;
`;

const IconWrapper = styled(Box)`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #4a90ff 0%, #50e3c2 100%);
    opacity: 0.2;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const StyledIcon = styled(TimelineOutlined)`
  && {
    font-size: 40px;
    color: #4a90ff;
    z-index: 1;
  }
`;

const MessageContainer = styled(Box)`
  text-align: center;
  max-width: 300px;
`;

const DotsContainer = styled(Box)`
  display: flex;
  gap: 8px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.color};
  animation: ${dots} 1.4s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const EmptyTicketSales = () => {
  return (
    <EmptyStateContainer>
      <IconWrapper>
        <StyledIcon />
      </IconWrapper>

      <MessageContainer>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 600,
            marginBottom: 1,
          }}
        >
          Pas de ventes récentes
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          Aucune vente n'a été enregistrée ces 7 derniers jours. Le graphique
          s'actualisera automatiquement à la prochaine vente.
        </Typography>
      </MessageContainer>

      <DotsContainer>
        <Dot color="#4A90FF" delay={0} />
        <Dot color="#50E3C2" delay={0.2} />
        <Dot color="#FFCF5C" delay={0.4} />
      </DotsContainer>
    </EmptyStateContainer>
  );
};

export default EmptyTicketSales;
