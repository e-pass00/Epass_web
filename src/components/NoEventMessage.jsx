import React from 'react';
import { Box, Typography } from '@mui/material';
import { CalendarOff } from 'lucide-react';
import styled from 'styled-components';

const StyledContainer = styled(Box)`
  position: relative;
  min-height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(28, 28, 28, 0.8) 0%,
    rgba(17, 17, 17, 0.9) 100%
  );
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled(Box)`
  position: relative;
  margin-bottom: 1.5rem;

  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    background: radial-gradient(
      circle,
      rgba(62, 207, 142, 0.2) 0%,
      transparent 70%
    );
    border-radius: 50%;
    z-index: 0;
  }
`;

const GradientText = styled(Typography)`
  background: linear-gradient(90deg, #3ecf8e 30%, #45b681 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TipBox = styled(Box)`
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: rgba(62, 207, 142, 0.08);
  border: 1px solid rgba(62, 207, 142, 0.15);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(62, 207, 142, 0.12);
  }
`;

const NoEventsMessage = ({ category = 'disponible' }) => {
  return (
    <StyledContainer>
      <IconWrapper>
        <CalendarOff
          size={48}
          style={{
            color: '#3ECF8E',
            position: 'relative',
            zIndex: 1,
          }}
        />
      </IconWrapper>

      <GradientText variant="h5">
        Aucun événement {category.toLowerCase()} pour le moment
      </GradientText>

      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '450px',
          lineHeight: 1.6,
        }}
      >
        Nous n'avons pas encore d'événements dans cette catégorie. Revenez
        bientôt pour découvrir les dernières nouveautés !
      </Typography>

      <TipBox>
        <Typography
          variant="body2"
          sx={{
            color: '#3ECF8E',
            fontStyle: 'italic',
          }}
        >
          💡 Explorez d'autres catégories ou revenez à "Tout voir"
        </Typography>
      </TipBox>
    </StyledContainer>
  );
};

export default NoEventsMessage;
