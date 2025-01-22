import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
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

// Styled Components avec Media Queries
const EmptyStateContainer = styled(Box)`
  min-height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.isMobile ? '16px' : '24px')};
  padding: ${(props) => (props.isMobile ? '16px' : '32px')};
`;

const IconWrapper = styled(Box)`
  position: relative;
  width: ${(props) => (props.isMobile ? '60px' : '80px')};
  height: ${(props) => (props.isMobile ? '60px' : '80px')};
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
    font-size: ${(props) => (props.isMobile ? '30px' : '40px')};
    color: #4a90ff;
    z-index: 1;
  }
`;

const MessageContainer = styled(Box)`
  text-align: center;
  max-width: ${(props) => (props.isMobile ? '260px' : '300px')};
  padding: 0 ${(props) => (props.isMobile ? '16px' : '0')};
`;

const DotsContainer = styled(Box)`
  display: flex;
  gap: ${(props) => (props.isMobile ? '6px' : '8px')};
`;

const Dot = styled.div`
  width: ${(props) => (props.isMobile ? '6px' : '8px')};
  height: ${(props) => (props.isMobile ? '6px' : '8px')};
  border-radius: 50%;
  background: ${(props) => props.color};
  animation: ${dots} 1.4s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
`;

const EmptyTicketSales = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <EmptyStateContainer isMobile={isMobile}>
      <IconWrapper isMobile={isMobile}>
        <StyledIcon isMobile={isMobile} />
      </IconWrapper>

      <MessageContainer isMobile={isMobile}>
        <Typography
          variant={isMobile ? 'subtitle1' : 'h6'}
          sx={{
            color: 'white',
            fontWeight: 600,
            marginBottom: isMobile ? 0.5 : 1,
            fontSize: isMobile ? '1.1rem' : '1.25rem',
          }}
        >
          Pas de ventes récentes
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: isMobile ? '0.875rem' : '1rem',
          }}
        >
          Aucune vente enregistrée pour ces 7 derniers jours. Le graphique
          s'actualisera à la prochaine vente.
        </Typography>
      </MessageContainer>

      <DotsContainer isMobile={isMobile}>
        <Dot color="#4A90FF" delay={0} isMobile={isMobile} />
        <Dot color="#50E3C2" delay={0.2} isMobile={isMobile} />
        <Dot color="#FFCF5C" delay={0.4} isMobile={isMobile} />
      </DotsContainer>
    </EmptyStateContainer>
  );
};

export default EmptyTicketSales;
