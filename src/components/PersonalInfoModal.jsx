import React from 'react';
import { Dialog, IconButton, Typography } from '@mui/material';
import { X, Edit2 } from 'lucide-react';
import styled from 'styled-components';
import { useUserInfo } from '../features/events/api/queries'; // Assurez-vous que le chemin d'importation est correct

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(17, 17, 17, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    color: white;
    width: 90%;
    max-width: 400px;
    padding: 2rem;
    position: relative;
  }

  @media (max-width: 400px) {
    .MuiDialog-paper {
      position: absolute;
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 0;
      padding: 1.5rem;
    }
  }
`;

const CloseButton = styled(IconButton)`
  position: absolute !important;
  right: 1rem;
  top: 1rem;
  color: white !important;

  @media (max-width: 600px) {
    right: 0.5rem;
    top: 0.5rem;
  }
`;

const ProfileImageContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
`;

const ImageWrapper = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
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

const InitialAvatar = styled.div`
  width: 100%;
  height: 100%;
  background-color: #14b8a6; // teal-500
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
`;

const EditButton = styled(IconButton)`
  position: absolute !important;
  bottom: 0;
  right: 0;
  background: #3ecf8e !important;
  padding: 8px !important;
  color: white !important;

  &:hover {
    background: #2fb77d !important;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoGroup = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem;
  border-radius: 12px;
`;

const InfoLabel = styled(Typography)`
  color: #a0a0a0 !important;
  font-size: 0.875rem !important;
  margin-bottom: 0.5rem !important;
`;

const InfoValue = styled(Typography)`
  color: white !important;
  font-size: 1rem !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
`;

const EditIcon = styled(Edit2)`
  color: #3ecf8e;
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const LoadingContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: white;
`;

const PersonalInfoModal = ({ open, onClose }) => {
  const { data: userData, isLoading } = useUserInfo();

  const getInitialLetter = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  if (isLoading) {
    return (
      <StyledDialog open={open} onClose={onClose}>
        <LoadingContainer>Chargement...</LoadingContainer>
      </StyledDialog>
    );
  }

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <CloseButton onClick={onClose}>
        <X size={24} />
      </CloseButton>

      <Typography
        variant="h5"
        component="h2"
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          marginTop: '1.5rem',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        Informations Personnelles
      </Typography>

      <ProfileImageContainer>
        <ImageWrapper>
          {userData?.role === 'organisateur' ? (
            <ProfileImage src={userData.profilePicture} alt="Profile" />
          ) : (
            <InitialAvatar>
              {getInitialLetter(userData?.username)}
            </InitialAvatar>
          )}
        </ImageWrapper>
        {userData?.role === 'organisateur' && (
          <EditButton>
            <Edit2 size={16} />
          </EditButton>
        )}
      </ProfileImageContainer>

      <InfoContainer>
        <InfoGroup>
          <InfoLabel>Nom d'utilisateur</InfoLabel>
          <InfoValue>
            {userData?.username}
            <EditIcon />
          </InfoValue>
        </InfoGroup>

        <InfoGroup>
          <InfoLabel>Adresse email</InfoLabel>
          <InfoValue>{userData?.email}</InfoValue>
        </InfoGroup>

        <InfoGroup>
          <InfoLabel>Rôle</InfoLabel>
          <InfoValue style={{ textTransform: 'capitalize' }}>
            {userData?.role}
          </InfoValue>
        </InfoGroup>
      </InfoContainer>
    </StyledDialog>
  );
};

export default PersonalInfoModal;
