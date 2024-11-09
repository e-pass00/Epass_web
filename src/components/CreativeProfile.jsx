import React from 'react';
import { Card, Typography } from '@mui/material';
import { Calendar, Lock, CreditCard, Ticket, Award } from 'lucide-react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  color: white;
  padding: 1rem;

  @media (min-width: 769px) {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const StyledCard = styled(Card)`
  background: rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(10px);
  border-radius: 24px !important;
  overflow: hidden;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    border-radius: 0 !important;
    height: 100%;
  }

  @media (min-width: 769px) {
    margin-top: 100px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 2rem;

  @media (min-width: 769px) {
    grid-template-columns: 300px 1fr;
    gap: 4rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 769px) {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    padding-right: 2rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(79, 209, 197, 0.2), transparent);
    border-radius: 50%;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Badge = styled.div`
  background: linear-gradient(135deg, #4fd1c5, #38b2ac);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 16px;
  width: 50%;
  justify-content: center;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled(Typography)`
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #4fd1c5 !important;
`;

const StatLabel = styled(Typography)`
  font-size: 0.875rem !important;
  color: #a0a0a0 !important;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MenuItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(79, 209, 197, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4fd1c5;
`;

const CreativeProfile = () => {
  const menuItems = [
    { icon: Calendar, label: "Gestion d'événements" },
    { icon: Lock, label: 'Information personnelle' },
    { icon: CreditCard, label: 'Paiements ' },
    { icon: Ticket, label: 'E-pass' },
  ];

  return (
    <ProfileContainer>
      <StyledCard>
        <ContentGrid>
          <ProfileSection>
            <ImageWrapper>
              <ProfileImage
                src="/api/placeholder/120/120"
                alt="Event profile"
              />
            </ImageWrapper>

            <div style={{ textAlign: 'center' }}>
              <Typography
                variant="h5"
                component="h2"
                style={{
                  color: 'white',
                  marginBottom: '0.5rem',
                  fontSize: '1.25rem',
                }}
              >
                Monarch Event
              </Typography>
              <Badge>
                <Award size={14} />
                Organisateur
              </Badge>
            </div>

            <Stats>
              <StatItem>
                <StatValue variant="h6">10</StatValue>
                <StatLabel variant="body2">Events</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue variant="h6">4.3</StatValue>
                <StatLabel variant="body2">Notes</StatLabel>
              </StatItem>
            </Stats>
          </ProfileSection>

          <MenuGrid>
            {menuItems.map((item, index) => (
              <MenuItem key={index}>
                <IconWrapper>
                  <item.icon size={20} />
                </IconWrapper>
                <Typography style={{ color: 'white' }}>{item.label}</Typography>
              </MenuItem>
            ))}
          </MenuGrid>
        </ContentGrid>
      </StyledCard>
    </ProfileContainer>
  );
};

export default CreativeProfile;
