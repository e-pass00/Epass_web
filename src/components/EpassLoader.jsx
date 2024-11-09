import React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

const LoaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
`;

const Dot = styled('div')`
  width: 12px;
  height: 12px;
  background-color: #3ecf8e;
  border-radius: 50%;
  animation: ${pulseAnimation} 1.4s ease-in-out infinite;

  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }

  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
`;

const EpassLoader = () => {
  return (
    <LoaderContainer>
      <Dot />
      <Dot />
      <Dot />
    </LoaderContainer>
  );
};

export default EpassLoader;
