import React, { useState } from 'react';
import { CircularProgress, Dialog } from '@mui/material';
import { Plus, ArrowLeft, Calendar, Clock, MapPin, Loader } from 'lucide-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import EventCreationModal from './eventCreation/EventCreationModal';
import { useUserEvents } from '../features/events/api/queries';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: #1a1a1a;
    width: 100vw;
    height: 100%;
    margin: 0;
    max-width: none;
    max-height: none;
    border-radius: 0;
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
      width: min(90vw, 480px);
      height: min(90vh, 700px);
      margin: auto;
      border-radius: 12px;
    }

    @media (max-height: 600px) {
      height: 100vh;
      border-radius: 0;
    }
  }

  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.85);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: clamp(0.75rem, 2vw, 1.25rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #e5e7eb;
  cursor: pointer;
  padding: clamp(0.3rem, 1vw, 0.5rem);
  margin-right: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Title = styled.h1`
  color: white;
  font-size: clamp(1rem, 7vw, 1.25rem);
  font-weight: 600;
  flex: 1;
`;

const EventsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: clamp(0.75rem, 2vw, 1rem);
  scrollbar-width: thin;
  scrollbar-color: #065f46 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3ecf8e;
    border-radius: 3px;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const ImageContainer = styled.div`
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  @media (max-width: 360px) {
    width: 120px;
    height: 120px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EventContent = styled.div`
  display: flex;
  padding: clamp(0.75rem, 2vw, 1rem);
  gap: clamp(0.5rem, 2vw, 1rem);
  min-height: 180px;

  @media (max-width: 360px) {
    min-height: 120px;
  }
`;

const EventCard = styled.div`
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-height: 600px) {
    margin-bottom: 0.5rem;
  }
`;

const EventDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const EventTitle = styled.h2`
  color: white;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-weight: 600;
  margin: 0 0 clamp(0.5rem, 1.5vw, 0.75rem) 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EventInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    color: #3ecf8e;
    flex-shrink: 0;
    width: clamp(14px, 4vw, 16px);
    height: clamp(14px, 4vw, 16px);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #3ecf8e;
  color: white;
  border-radius: 9999px;
  font-size: clamp(0.7rem, 1.8vw, 0.75rem);
  font-weight: 500;
  margin-top: clamp(0.25rem, 1vw, 0.5rem);
`;

const AddButtonContainer = styled.div`
  padding: clamp(0.75rem, 2vw, 1rem);
  background: linear-gradient(to top, #1a1a1a 80%, transparent);
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const AddButton = styled.button`
  width: clamp(3rem, 8vw, 3.5rem);
  height: clamp(3rem, 8vw, 3.5rem);
  border-radius: 12px;
  background: #3ecf8e;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    background: #047857;
    transform: translateY(-2px);
  }

  svg {
    width: clamp(20px, 5vw, 24px);
    height: clamp(20px, 5vw, 24px);
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  text-align: center;
  padding: 1rem;
`;

const EventManagementModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [showCreationModal, setShowCreationModal] = useState(false);
  const { data, isLoading, error, refetch } = useUserEvents();

  const handleEventClick = (eventId) => {
    onClose();
    navigate(`/dashboard/${eventId}`);
  };

  const formatEventDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'EEE, d MMMM', { locale: fr });
  };

  const formatEventTime = (start, end) => {
    try {
      // Vérifier si start existe
      if (!start) return '';

      // Vérifier si start est déjà un objet Date
      const startDate = start instanceof Date ? start : new Date(start);
      if (!isValid(startDate)) return '';

      // Formatter l'heure de début
      const startTime = format(startDate, "HH'h'mm", { locale: fr });

      // Si pas d'heure de fin, retourner uniquement l'heure de début
      if (!end) return startTime;

      // Vérifier si end est déjà un objet Date
      const endDate = end instanceof Date ? end : new Date(end);
      if (!isValid(endDate)) return startTime;

      // Formatter l'heure de fin
      const endTime = format(endDate, "HH'h'mm", { locale: fr });

      // Retourner le format complet
      return `${startTime} - ${endTime}`;
    } catch (error) {
      console.error('Error formatting time:', error, { start, end });
      return ''; // Retourner une chaîne vide en cas d'erreur
    }
  };
  const getStatusBadgeColor = (state) => {
    switch (state) {
      case 'draft':
        return '#6B7280';
      case 'published':
        return '#3ecf8e';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#3ecf8e';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoaderContainer>
          <CircularProgress style={{ color: '#3ecf8e' }} />
        </LoaderContainer>
      );
    }

    if (error) {
      return (
        <ErrorContainer>
          <p>Une erreur est survenue lors du chargement des événements.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Réessayer
          </button>
        </ErrorContainer>
      );
    }

    return (
      <EventsContainer>
        {data?.events?.map((event) => (
          <EventCard key={event.id} onClick={() => handleEventClick(event.id)}>
            <EventContent>
              <ImageContainer>
                <EventImage src={event.coverImage} alt={event.name} />
              </ImageContainer>
              <EventDetails>
                <div className="flex justify-between items-start">
                  <EventTitle>{event.name}</EventTitle>
                </div>
                <EventInfo>
                  <Calendar />
                  {formatEventDate(event.startDate)}
                </EventInfo>
                <EventInfo>
                  <Clock />
                  {formatEventTime(event.startDate, event.endDate)}
                </EventInfo>
                <EventInfo>
                  <MapPin />
                  {event.locationName || 'Emplacement non défini'}
                </EventInfo>
                <StatusBadge
                  style={{ backgroundColor: getStatusBadgeColor(event.state) }}
                >
                  {event.state}
                </StatusBadge>
              </EventDetails>
            </EventContent>
          </EventCard>
        ))}
      </EventsContainer>
    );
  };

  return (
    <StyledDialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      fullScreen
    >
      <Header>
        <BackButton onClick={onClose}>
          <ArrowLeft size={20} />
        </BackButton>
        <Title>Gestion d'événements</Title>
      </Header>

      {renderContent()}

      <AddButtonContainer>
        <AddButton onClick={() => setShowCreationModal(true)}>
          <Plus />
        </AddButton>
      </AddButtonContainer>

      <EventCreationModal
        open={showCreationModal}
        onClose={() => setShowCreationModal(false)}
      />
    </StyledDialog>
  );
};

export default EventManagementModal;
