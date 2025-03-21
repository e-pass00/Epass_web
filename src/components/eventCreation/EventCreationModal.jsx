import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog } from '@mui/material';
import { useCreateEvent } from '../../features/events/api/queries';
import useAuthStore from '../../features/auth/stores/authStore';
import {
  X,
  Music,
  Theater,
  Tv,
  Award,
  Users,
  Mic,
  Laptop,
  Package,
  CheckCircle,
} from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventDetails from './EventDetails';
import EventCategory from './EventCategory';
import EventLocation from './EventLocation';
import EventDateTime from './EventDateTime';
import TicketTypes from './TicketTypes';
import TicketConfiguration from './TiketConfiguration';
import MediaUpload from './MediaUpload';
import EventSummary from './EventSummary';
import confetti from 'canvas-confetti';

// Constants
const TOTAL_STEPS = 8;
const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  category: '',
  performers: [],
  location: {
    country: '',
    city: '',
    address: '',
    venue: '',
    coordinates: '',
  },
  datetime: {
    date: '',
    startTime: '',
    endTime: '',
  },
  selectedTicketTypes: [],
  tickets: {
    standard: { price: '', benefits: [''], quantity: '' },
    vip: { price: '', benefits: [''], quantity: '' },
    vvip: { price: '', benefits: [''], quantity: '' },
    carreOr: { price: '', benefits: [''], quantity: '' },
  },
  media: {
    image: null,
    video: null,
  },
};

const ticketTypes = [
  { id: 'standard', name: 'Standard' },
  { id: 'vip', name: 'VIP' },
  { id: 'vvip', name: 'VVIP' },
  { id: 'carreOr', name: 'Carré Or' },
];

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

// Styled Components (inchangés)
const StyledDialog = styled(Dialog)`
  z-index: 1300 !important;
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
      width: min(90vw, 640px);
      height: min(90vh, 800px);
      margin: auto;
      border-radius: 12px;
    }
  }
  .MuiBackdrop-root {
    background-color: rgba(0, 0, 0, 0.85);
  }
`;

const SuccessContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  color: white;
`;

const SuccessIcon = styled.div`
  animation: ${bounce} 1s ease-in-out;
  color: #3ecf8e;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #3ecf8e;
`;

const SuccessMessage = styled.p`
  font-size: 1.2rem;
  color: #e5e7eb;
  margin-bottom: 2rem;
`;

const StyledToastContainer = styled(ToastContainer)`
  &.Toastify__toast-container {
    z-index: 10000 !important;
  }
  .Toastify__toast {
    background-color: #ff4d4d;
    color: white;
    padding: 15px;
    border-radius: 10px;
    font-weight: 500;
  }
  .Toastify__toast-container--top-center {
    top: 1em;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.1rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #e5e7eb;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StepperContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 2.5rem;
    right: 2.5rem;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-50%);
    z-index: 1;
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
  position: relative;
`;

const StepCircle = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${({ active, completed }) =>
    active ? '#3ecf8e' : completed ? '#1f8b5f' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ active, completed }) =>
    active || completed ? 'white' : '#6b7280'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: ${({ active }) =>
    active ? '0 0 0 4px rgba(62, 207, 142, 0.1)' : 'none'};
`;

const Content = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${({ primary, success }) =>
    success
      ? `
        background: #3ecf8e;
        color: white;
        border: none;
        width: 200px;
        justify-content: center;
        &:hover {
          background: #047857;
        }
      `
      : primary
        ? `
        background: #3ecf8e;
        color: white;
        border: none;
        &:hover {
          background: #047857;
        }
      `
        : `
        background: transparent;
        color: #e5e7eb;
        border: 1px solid rgba(255, 255, 255, 0.1);
        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      `}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Utility functions
const validateCoordinates = (coordinates) => {
  if (!coordinates) return false;
  const [lat, lng] = coordinates.split(',').map((coord) => coord.trim());
  const latRegex = /^-?([0-8]?\d|90)(\.\d+)?$/;
  const lngRegex = /^-?((1[0-7]\d)|([0-9]?\d))(\.\d+)?$/;
  return (
    latRegex.test(lat) &&
    lngRegex.test(lng) &&
    parseFloat(lat) >= -90 &&
    parseFloat(lat) <= 90 &&
    parseFloat(lng) >= -180 &&
    parseFloat(lng) <= 180
  );
};

const validateTimes = (startTime, endTime) => {
  if (!startTime) return false;
  if (!endTime) return true;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  return startHour * 60 + startMinute < endHour * 60 + endMinute;
};

const showError = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

// Main Component
const EventCreationModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [mediaPreviews, setMediaPreviews] = useState({
    image: null,
    video: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: createEvent } = useCreateEvent();
  const { user } = useAuthStore();

  const categories = useMemo(
    () => [
      { id: 'concert', name: 'Concert', icon: Music },
      { id: 'showcase', name: 'Showcase', icon: Mic },
      { id: 'theatre', name: 'Théâtre', icon: Theater },
      { id: 'sport', name: 'Sport', icon: Award },
      { id: 'spectacle', name: 'Spectacle', icon: Tv },
      { id: 'conference', name: 'Conférence', icon: Users },
      { id: 'technologie', name: 'Technologie', icon: Laptop },
      { id: 'autre', name: 'Autre', icon: Package },
    ],
    []
  );

  const stepTitles = useMemo(
    () => ({
      1: "Détails de l'événement",
      2: 'Catégorie',
      3: 'Localisation',
      4: 'Date et heure',
      5: 'Types de billets',
      6: 'Configuration des billets',
      7: 'Médias',
      8: 'Résumé',
    }),
    []
  );

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 10000,
    };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const particleCount = 50;
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    setTimeout(() => clearInterval(interval), duration);
  }, []);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTicketTypeToggle = useCallback((typeId) => {
    setFormData((prev) => {
      const selected = prev.selectedTicketTypes.includes(typeId)
        ? prev.selectedTicketTypes.filter((id) => id !== typeId)
        : [...prev.selectedTicketTypes, typeId];
      return { ...prev, selectedTicketTypes: selected };
    });
  }, []);

  const handleFileChange = useCallback((type, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      media: { ...prev.media, [type]: file },
    }));
    setMediaPreviews((prev) => ({ ...prev, [type]: url }));
  }, []);

  const removeMedia = useCallback((type) => {
    setFormData((prev) => ({
      ...prev,
      media: { ...prev.media, [type]: null },
    }));
    setMediaPreviews((prev) => {
      if (prev[type]) URL.revokeObjectURL(prev[type]);
      return { ...prev, [type]: null };
    });
  }, []);

  const handleBenefitChange = useCallback((ticketType, index, value) => {
    setFormData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [ticketType]: {
          ...prev.tickets[ticketType],
          benefits: prev.tickets[ticketType].benefits.map((benefit, i) =>
            i === index ? value : benefit
          ),
        },
      },
    }));
  }, []);

  const addBenefit = useCallback((ticketType) => {
    setFormData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [ticketType]: {
          ...prev.tickets[ticketType],
          benefits: [...prev.tickets[ticketType].benefits, ''],
        },
      },
    }));
  }, []);

  const removeBenefit = useCallback((ticketType, index) => {
    setFormData((prev) => ({
      ...prev,
      tickets: {
        ...prev.tickets,
        [ticketType]: {
          ...prev.tickets[ticketType],
          benefits: prev.tickets[ticketType].benefits.filter(
            (_, i) => i !== index
          ),
        },
      },
    }));
  }, []);

  const validateStep = useCallback(
    (currentStep) => {
      const validationRules = {
        1: () => {
          if (!formData.name.trim() || !formData.description.trim()) {
            showError(
              "Veuillez remplir le nom et la description de l'événement"
            );
            return false;
          }
          if (formData.name.trim().length < 3) {
            showError(
              "Le nom de l'événement doit contenir au moins 3 caractères"
            );
            return false;
          }
          if (formData.description.trim().length < 10) {
            showError('La description doit contenir au moins 10 caractères');
            return false;
          }
          return true;
        },
        2: () => {
          if (!formData.category) {
            showError("Veuillez sélectionner une catégorie d'événement");
            return false;
          }
          return true;
        },
        3: () => {
          const { country, city, venue, address, coordinates } =
            formData.location;
          if (!country || !city || !venue || !address || !coordinates) {
            showError('Veuillez remplir tous les champs de localisation');
            return false;
          }
          if (!validateCoordinates(coordinates)) {
            showError('Format des coordonnées GPS invalide');
            return false;
          }
          return true;
        },
        4: () => {
          const { date, startTime, endTime } = formData.datetime;
          if (!date || !startTime) {
            showError('Veuillez sélectionner une date et une heure de début');
            return false;
          }
          if (endTime && !validateTimes(startTime, endTime)) {
            showError(
              "L'heure de fin doit être postérieure à l'heure de début"
            );
            return false;
          }
          return true;
        },
        5: () => {
          if (formData.selectedTicketTypes.length === 0) {
            showError('Veuillez sélectionner au moins un type de billet');
            return false;
          }
          return true;
        },
        6: () => {
          let isValid = true;
          formData.selectedTicketTypes.forEach((type) => {
            const ticket = formData.tickets[type];
            if (!ticket.price || !ticket.quantity) {
              showError(
                `Veuillez remplir le prix et la quantité pour les billets ${
                  ticketTypes.find((t) => t.id === type).name
                }`
              );
              isValid = false;
            }
            if (
              isNaN(parseFloat(ticket.price)) ||
              isNaN(parseInt(ticket.quantity))
            ) {
              showError(
                `Prix ou quantité invalide pour les billets ${
                  ticketTypes.find((t) => t.id === type).name
                }`
              );
              isValid = false;
            }
          });
          return isValid;
        },
        7: () => {
          if (!formData.media.image) {
            showError('Veuillez ajouter au moins une image de couverture');
            return false;
          }
          return true;
        },
      };
      return validationRules[currentStep]?.() ?? true;
    },
    [formData]
  );

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!user || !user.uid) {
        throw new Error('Vous devez être connecté pour créer un événement');
      }

      const { coordinates } = formData.location;
      if (!validateCoordinates(coordinates)) {
        throw new Error('Coordonnées GPS invalides');
      }

      const event = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        performers: formData.performers,
        location: {
          address: formData.location.address.trim(),
          city:
            formData.location.city.charAt(0).toUpperCase() +
            formData.location.city.slice(1),
          coordinates: {
            latitude: parseFloat(coordinates.split(',')[0]),
            longitude: parseFloat(coordinates.split(',')[1]),
          },
          country:
            formData.location.country.charAt(0).toUpperCase() +
            formData.location.country.slice(1),
          name: formData.location.venue.trim(),
        },
        startDate: `${formData.datetime.date}T${formData.datetime.startTime}:00Z`,
        endDate: formData.datetime.endTime
          ? `${formData.datetime.date}T${formData.datetime.endTime}:00Z`
          : null,
      };

      const ticketCategories = formData.selectedTicketTypes.map((typeId) => {
        const type = ticketTypes.find((t) => t.id === typeId);
        const price = parseFloat(formData.tickets[typeId].price);
        const quantity = parseInt(formData.tickets[typeId].quantity);
        if (isNaN(price) || isNaN(quantity)) {
          throw new Error(
            `Prix ou quantité invalide pour le type ${type.name}`
          );
        }
        return {
          name: type.name,
          price,
          initQuantity: quantity,
          advantages: formData.tickets[typeId].benefits.filter(
            (benefit) => benefit.trim() !== ''
          ),
        };
      });

      const formDataToSend = new FormData();
      formDataToSend.append('event', JSON.stringify(event));
      formDataToSend.append(
        'ticketCategories',
        JSON.stringify(ticketCategories)
      );
      formDataToSend.append('coverImage', formData.media.image);
      if (formData.media.video instanceof File) {
        formDataToSend.append('coverVideo', formData.media.video);
      }

      console.log('Contenu du FormData avant envoi:');
      for (const [key, value] of formDataToSend.entries()) {
        console.log(
          `${key}: ${value instanceof File ? `File (${value.name})` : value}`
        );
      }

      await createEvent(formDataToSend, {
        onSuccess: () => {
          setIsLoading(false);
          setIsSuccess(true);
          triggerConfetti();
        },
        onError: (error) => {
          setIsLoading(false);
          showError(error.message || 'Une erreur est survenue');
          console.error('Erreur complète:', error);
        },
      });
    } catch (error) {
      setIsLoading(false);
      showError(error.message || 'Veuillez vérifier les informations saisies');
      console.error('Erreur dans handleSubmit:', error);
    }
  }, [formData, createEvent, triggerConfetti, user]);

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      if (validateStep(step)) {
        setStep((prev) => prev + 1);
      }
    } else {
      handleSubmit();
    }
  }, [step, validateStep, handleSubmit]);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  }, [step]);

  const handleClose = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setStep(1);
    setIsSuccess(false);
    onClose();
  }, [onClose]);

  const renderStepContent = useCallback(() => {
    const components = {
      1: <EventDetails formData={formData} handleChange={handleChange} />,
      2: (
        <EventCategory
          categories={categories}
          formData={formData}
          handleChange={handleChange}
        />
      ),
      3: <EventLocation formData={formData} handleChange={handleChange} />,
      4: <EventDateTime formData={formData} handleChange={handleChange} />,
      5: (
        <TicketTypes
          formData={formData}
          handleTicketTypeToggle={handleTicketTypeToggle}
        />
      ),
      6: (
        <TicketConfiguration
          formData={formData}
          handleChange={handleChange}
          handleBenefitChange={handleBenefitChange}
          addBenefit={addBenefit}
          removeBenefit={removeBenefit}
        />
      ),
      7: (
        <MediaUpload
          formData={formData}
          mediaPreviews={mediaPreviews}
          handleFileChange={handleFileChange}
          removeMedia={removeMedia}
        />
      ),
      8: <EventSummary formData={formData} mediaPreviews={mediaPreviews} />,
    };
    return components[step] || null;
  }, [
    step,
    formData,
    categories,
    mediaPreviews,
    handleChange,
    handleTicketTypeToggle,
    handleBenefitChange,
    handleFileChange,
    removeMedia,
    addBenefit,
    removeBenefit,
  ]);

  const renderSuccessContent = useCallback(
    () => (
      <SuccessContainer>
        <SuccessIcon>
          <CheckCircle size={80} />
        </SuccessIcon>
        <SuccessTitle>Événement créé avec succès !</SuccessTitle>
        <SuccessMessage>
          Votre événement a été créé et sera bientôt visible sur la plateforme.
        </SuccessMessage>
        <Button success onClick={handleClose}>
          Fermer
        </Button>
      </SuccessContainer>
    ),
    [handleClose]
  );

  useEffect(() => {
    return () => {
      Object.values(mediaPreviews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [mediaPreviews]);

  return (
    <>
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
          <h2>{isSuccess ? 'Félicitations !' : stepTitles[step]}</h2>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </Header>
        {!isSuccess && (
          <StepperContainer>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
              (number) => (
                <Step key={number}>
                  <StepCircle
                    active={step === number}
                    completed={step > number}
                  >
                    {number}
                  </StepCircle>
                </Step>
              )
            )}
          </StepperContainer>
        )}
        {isSuccess ? (
          renderSuccessContent()
        ) : (
          <>
            <Content>{renderStepContent()}</Content>
            <Footer>
              <Button onClick={handleBack} disabled={step === 1 || isLoading}>
                Retour
              </Button>
              <Button primary onClick={handleNext} disabled={isLoading}>
                {isLoading
                  ? 'Création en cours...'
                  : step === TOTAL_STEPS
                    ? "Créer l'événement"
                    : 'Suivant'}
              </Button>
            </Footer>
          </>
        )}
        <StyledToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="dark"
        />
      </StyledDialog>
    </>
  );
};

export default EventCreationModal;
