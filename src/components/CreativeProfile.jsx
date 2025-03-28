import React from 'react';
import { Box, Card, CircularProgress, Typography } from '@mui/material';
import { Calendar, Lock, CreditCard, Award } from 'lucide-react';
import styled from 'styled-components';
import PersonalInfoModal from './PersonalInfoModal';
import EventManagementModal from './EventManagementModal';
import { useUserInfo } from '../features/events/api/queries';

const ProfileContainer = styled.div`
  color: white;
  padding: 1rem;

  @media (min-width: 769px) {
    padding: 2rem;
    max-width: 720px;
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
  padding: 2rem 1rem;

  @media (min-width: 769px) {
    grid-template-columns: 250px 1fr; /* Changed from 200px to 250px */
    gap: 2rem;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 769px) {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    padding-right: 1.5rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background: #14b8a6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  text-transform: uppercase;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), transparent);
    border-radius: 50%;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Badge = styled.div`
  background: #14b8a6;
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
  width: auto;
  min-width: 180px;
  justify-content: center;
`;

const StatItem = styled.div`
  text-align: center;
  min-width: 60px;
`;

const StatValue = styled(Typography)`
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #14b8a6 !important;
`;

const StatLabel = styled(Typography)`
  font-size: 0.75rem !important;
  color: #a0a0a0 !important;
  white-space: nowrap;
`;

const RightContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const MenuGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 280px;
`;

const MenuItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 48px;
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  min-width: 28px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(20, 184, 166, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #14b8a6;
`;

const MenuText = styled(Typography)`
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  flex: 1;
`;

const CreativeProfile = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
  const { data: user, isLoading } = useUserInfo();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const isOrganizer = user?.role == 'Organisateur';

  const menuItems = [
    ...(isOrganizer
      ? [
          {
            icon: Calendar,
            label: "Gestion d'événements",
            onClick: () => setIsEventModalOpen(true),
          },
        ]
      : []),
    {
      icon: Lock,
      label: 'Information personnelle',
      onClick: () => setIsModalOpen(true),
    },
    { icon: CreditCard, label: 'Paiements' },
  ];

  const renderProfileImage = () => {
    if (isOrganizer && user.profilePicture) {
      return <ProfileImage src={user.profilePicture} alt="Profile" />;
    }
    return user?.username?.[0] || 'U';
  };

  return (
    <ProfileContainer>
      <StyledCard>
        <ContentGrid>
          <ProfileSection>
            <ImageWrapper>{renderProfileImage()}</ImageWrapper>

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
                {user?.username || 'User'}
              </Typography>
              {isOrganizer && (
                <Badge>
                  <Award size={14} />
                  Organisateur
                </Badge>
              )}
            </div>

            {isOrganizer && (
              <Stats>
                <StatItem>
                  <StatValue variant="h6">10</StatValue>
                  <StatLabel variant="body2">Événements</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue variant="h6">4.3</StatValue>
                  <StatLabel variant="body2">Notes</StatLabel>
                </StatItem>
              </Stats>
            )}
          </ProfileSection>

          <RightContentWrapper>
            <MenuGrid>
              {menuItems.map((item, index) => (
                <MenuItem key={index} onClick={item.onClick}>
                  <IconWrapper>
                    <item.icon size={16} />
                  </IconWrapper>
                  <MenuText>{item.label}</MenuText>
                </MenuItem>
              ))}
            </MenuGrid>
          </RightContentWrapper>
        </ContentGrid>
      </StyledCard>
      <PersonalInfoModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <EventManagementModal
        open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </ProfileContainer>
  );
};

export default CreativeProfile;
