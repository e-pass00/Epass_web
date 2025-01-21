import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useCreateEvent } from '../features/events/api/queries';
import {
  X,
  Image as ImageIcon,
  Video,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Euro,
  Music,
  Theater,
  Tv,
  Award,
  Users,
  Mic,
  Laptop,
  Package,
  Navigation,
  Plus,
  Minus,
} from 'lucide-react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styles
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
  background: ${(props) =>
    props.active
      ? '#3ecf8e'
      : props.completed
        ? '#1f8b5f'
        : 'rgba(255, 255, 255, 0.1)'};
  color: ${(props) => (props.active || props.completed ? 'white' : '#6b7280')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: ${(props) =>
    props.active ? '0 0 0 4px rgba(62, 207, 142, 0.1)' : 'none'};
`;

const Content = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.975rem;
  font-weight: 600;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3ecf8e;
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3ecf8e;
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #3ecf8e;
  }

  option {
    background: #1a1a1a;
    color: white;
    padding: 0.5rem;
  }
`;

const LocationInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .input-container {
    width: 100%;
  }

  .locate-button {
    width: fit-content;
  }
`;

const SummarySection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  h4 {
    color: #3ecf8e;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .content {
    margin-left: 1.5rem;
  }

  .detail-item {
    margin-bottom: 0.75rem;

    .label {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .value {
      color: white;
      font-size: 1rem;
    }
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const CategoryCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${(props) =>
    props.selected ? 'rgba(62, 207, 142, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid
    ${(props) => (props.selected ? '#3ecf8e' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: rgba(62, 207, 142, 0.05);
    border-color: #3ecf8e;
  }
`;

const CategoryIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: ${(props) =>
    props.selected ? '#3ecf8e' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.selected ? 'white' : '#6b7280')};
`;

const CategoryName = styled.span`
  color: ${(props) => (props.selected ? '#3ecf8e' : 'white')};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
`;

const DateTimeSection = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const DateTimeHeader = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;

  h3 {
    color: #3ecf8e;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const DateTimeContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DateInputWrapper = styled.div`
  position: relative;
  margin-top: 8px;

  &::after {
    content: '';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 60%;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TimePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TimeInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2rem;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  padding-left: 2.75rem;
  margin-top: -20px;
  color: white;
  font-size: 0.9375rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3ecf8e;
    background: rgba(62, 207, 142, 0.05);
    box-shadow: 0 0 0 3px rgba(62, 207, 142, 0.1);
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.5;
    cursor: pointer;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TicketTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

const TicketTypeCard = styled(CategoryCard)`
  padding: 0.75rem;
`;

const LocationField = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const LocationIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${(props) =>
    props.primary
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

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const UploadContainer = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3ecf8e;
  }
`;
const TicketSection = styled.div`
  margin-bottom: 2rem;
`;

const TicketCard = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TicketTitle = styled.h3`
  color: #3ecf8e;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  padding: 0;
  margin: 0;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const TicketGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PriceInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 1rem;
    color: #6b7280;
  }

  input {
    padding-left: 3rem;
    width: 100%;
  }
`;

const StyledInputs = styled(Input)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 3rem;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3ecf8e;
    box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.2);
    background: rgba(62, 207, 142, 0.05);
  }
`;

const StyledTextArea = styled(TextArea)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 120px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3ecf8e;
    box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.2);
    background: rgba(62, 207, 142, 0.05);
  }
`;

const InputLabel = styled(Label)`
  color: #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #3ecf8e;
  }
`;

const BenefitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const BenefitInputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const BenefitInput = styled(StyledInputs)`
  flex: 1;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.remove ? '#ff4d4d' : '#3ecf8e')};
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const EventCreationModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);

  const initialFormData = {
    name: '',
    description: '',
    category: '',
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

  const [formData, setFormData] = useState(initialFormData);

  const [mediaPreviews, setMediaPreviews] = useState({
    image: null,
    video: null,
  });

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createEvent } = useCreateEvent();

  const categories = [
    { id: 'concert', name: 'Concert', icon: Music },
    { id: 'showcase', name: 'Showcase', icon: Mic },
    { id: 'theatre', name: 'Théâtre', icon: Theater },
    { id: 'sport', name: 'Sport', icon: Award },
    { id: 'spectacle', name: 'Spectacle', icon: Tv },
    { id: 'conference', name: 'Conférence', icon: Users },
    { id: 'technologie', name: 'Technologie', icon: Laptop },
    { id: 'autre', name: 'Autre', icon: Package },
  ];

  const ticketTypes = [
    { id: 'standard', name: 'Standard' },
    { id: 'vip', name: 'VIP' },
    { id: 'vvip', name: 'VVIP' },
    { id: 'carreOr', name: 'Carré Or' },
  ];

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim() || !formData.description.trim()) {
          setIsError(true);

          toast.error(
            "Veuillez remplir le nom et la description de l'événement",
            {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: 'custom-toast-error',
            }
          );
          return false;
        }
        return true;

      case 2:
        if (!formData.category) {
          setIsError(true);
          toast.error("Veuillez sélectionner une catégorie d'événement", {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast-error',
          });
          return false;
        }
        return true;

      case 3:
        const { country, city, venue, address, coordinates } =
          formData.location;
        if (!country || !city || !venue || !address || !coordinates) {
          setIsError(true);
          toast.error('Veuillez remplir tous les champs de localisation', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast-error',
          });
          return false;
        }
        if (!validateCoordinates(coordinates)) {
          setIsError(true);
          toast.error('Format des coordonnées GPS invalide', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast-error',
          });
          return false;
        }
        return true;

      case 4:
        const { date, startTime, endTime } = formData.datetime;
        if (!date || !startTime) {
          setIsError(true);
          toast.error('Veuillez sélectionner une date et une heure de début', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast-error',
          });
          return false;
        }
        if (endTime && !validateTimes(startTime, endTime)) {
          setIsError(true);
          toast.error(
            "L'heure de fin doit être postérieure à l'heure de début",
            {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: 'custom-toast-error',
            }
          );
          return false;
        }
        return true;

      case 5:
        if (formData.selectedTicketTypes.length === 0) {
          setIsError(true);
          toast.error('Veuillez sélectionner au moins un type de billet', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast-error',
          });
          return false;
        }
        return true;

      case 6:
        let isValid = true;
        formData.selectedTicketTypes.forEach((type) => {
          const ticket = formData.tickets[type];
          if (!ticket.price || !ticket.quantity) {
            setIsError(true);
            toast.error(
              `Veuillez remplir le prix et la quantité pour les billets ${type.toUpperCase()}`,
              {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast-error',
              }
            );
            isValid = false;
          }
        });
        return isValid;

      case 7:
        if (!formData.media.image) {
          setIsError(true);
          toast.error('Veuillez ajouter au moins une image de couverture', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast-error',
          });
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const validateCoordinates = (coordinates) => {
    if (!coordinates) return false;

    const [lat, lng] = coordinates.split(',').map((coord) => coord.trim());

    // Vérifier le format des coordonnées
    const latRegex = /^-?([0-8]?\d|90)(\.\d+)?$/;
    const lngRegex = /^-?((1[0-7]\d)|([0-9]?\d))(\.\d+)?$/;

    if (!lat || !lng) return false;
    if (!latRegex.test(lat) || !lngRegex.test(lng)) return false;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Vérifier les plages valides
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  };

  const validateTimes = (startTime, endTime) => {
    if (!startTime) return false;

    // Si l'heure de fin n'est pas fournie, c'est valide
    if (!endTime) return true;

    // Convertir les heures en minutes pour faciliter la comparaison
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;

    return startInMinutes < endInMinutes;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTicketTypeToggle = (typeId) => {
    setFormData((prev) => ({
      ...prev,
      selectedTicketTypes: prev.selectedTicketTypes.includes(typeId)
        ? prev.selectedTicketTypes.filter((id) => id !== typeId)
        : [...prev.selectedTicketTypes, typeId],
    }));
  };

  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [type]: file,
      },
    }));

    const url = URL.createObjectURL(file);
    setMediaPreviews((prev) => ({
      ...prev,
      [type]: url,
    }));
  };

  const removeMedia = (type) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [type]: null,
      },
    }));
    setMediaPreviews((prev) => ({
      ...prev,
      [type]: null,
    }));
    if (mediaPreviews[type]) URL.revokeObjectURL(mediaPreviews[type]);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setMediaPreviews({
      image: null,
      video: null,
    });
    setStep(1);
  };

  const handleSubmit = async () => {
    try {
      if (!validateCoordinates(formData.location.coordinates)) {
        setIsError(true);
        toast.error(
          'Format des coordonnées GPS invalide. Utilisez le format: latitude,longitude',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: 'custom-toast-error',
          }
        );
        return;
      }

      // Valider les heures
      if (
        !validateTimes(formData.datetime.startTime, formData.datetime.endTime)
      ) {
        setIsError(true);
        toast.error("L'heure de début doit être inférieure à l'heure de fin", {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'custom-toast-error',
        });
        return;
      }

      setIsLoading(true);

      const eventData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          coordinates: {
            latitude: parseFloat(formData.location.coordinates.split(',')[0]),
            longitude: parseFloat(formData.location.coordinates.split(',')[1]),
          },
          country: formData.location.country,
          name: formData.location.venue,
        },
        startDate: `${formData.datetime.date}T${formData.datetime.startTime}:00`,
        endDate: `${formData.datetime.date}T${formData.datetime.endTime}:00`,
        organizerId: 'votre-id-organisateur',
      };

      const ticketCategories = formData.selectedTicketTypes.map((type) => ({
        name: type === 'carreOr' ? 'Carré Or' : type.toUpperCase(),
        price: parseFloat(formData.tickets[type].price),
        initQuantity: parseInt(formData.tickets[type].quantity),
        advantages: formData.tickets[type].benefits.filter(
          (benefit) => benefit.trim() !== ''
        ),
      }));

      createEvent(
        {
          eventData,
          ticketCategories,
          coverImage: formData.media.image,
          coverVideo: formData.media.video,
        },
        {
          onSuccess: (data) => {
            toast.success('Événement créé avec succès!', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: 'custom-toast-success',
            });
            setIsLoading(false);
            setIsError(false);
            resetForm();
            onClose();
          },
          onError: (error) => {
            setIsLoading(false);
            setIsError(true);
            let errorMessage = error.message;

            if (error.error === 'AUTH_ERROR') {
              errorMessage = "Veuillez vous reconnecter pour créer l'événement";
            } else if (error.error === 'FORBIDDEN') {
              errorMessage =
                "Vous n'avez pas les droits nécessaires pour créer un événement";
            } else if (error.error === 'NETWORK_ERROR') {
              errorMessage =
                'Problème de connexion. Vérifiez votre connexion internet';
            }

            toast.error(errorMessage, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: 'custom-toast-error',
            });
          },
        }
      );
    } catch (error) {
      toast.error('Veuillez vérifier les informations saisies', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'custom-toast-error',
      });
    }
  };

  const handleNext = () => {
    if (step < 8) {
      if (validateStep(step)) {
        setStep(step + 1);
      }
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBenefitChange = (ticketType, index, value) => {
    const updatedTickets = { ...formData.tickets };
    updatedTickets[ticketType].benefits[index] = value;
    handleChange('tickets', updatedTickets);
  };

  const addBenefit = (ticketType) => {
    const updatedTickets = { ...formData.tickets };
    updatedTickets[ticketType].benefits.push('');
    handleChange('tickets', updatedTickets);
  };

  const removeBenefit = (ticketType, index) => {
    const updatedTickets = { ...formData.tickets };
    updatedTickets[ticketType].benefits = updatedTickets[
      ticketType
    ].benefits.filter((_, i) => i !== index);
    handleChange('tickets', updatedTickets);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Détails de l'événement";
      case 2:
        return 'Catégorie';
      case 3:
        return 'Localisation';
      case 4:
        return 'Date et heure';
      case 5:
        return 'Types de billets';
      case 6:
        return 'Configuration des billets';
      case 7:
        return 'Médias';
      case 8:
        return 'Résumé';
      default:
        return '';
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form>
            <FormGroup>
              <Label>Nom de l'événement</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Concert de Noël 2024"
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Décrivez votre événement..."
              />
            </FormGroup>
          </Form>
        );
      case 2:
        return (
          <div>
            <Label>Catégorie d'événement</Label>
            <CategoryGrid>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  selected={formData.category === category.id}
                  onClick={() => handleChange('category', category.id)}
                  type="button"
                >
                  <CategoryIcon selected={formData.category === category.id}>
                    <category.icon size={20} />
                  </CategoryIcon>
                  <CategoryName selected={formData.category === category.id}>
                    {category.name}
                  </CategoryName>
                </CategoryCard>
              ))}
            </CategoryGrid>
          </div>
        );
      case 3:
        return (
          <Form>
            <FormGroup>
              <Label>Pays</Label>
              <Select
                value={formData.location.country}
                onChange={(e) =>
                  handleChange('location', {
                    ...formData.location,
                    country: e.target.value,
                  })
                }
              >
                <option value="">Sélectionnez un pays</option>
                <option value="congo">République du Congo</option>
                <option value="drc">République Démocratique du Congo</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Ville</Label>
              <Select
                value={formData.location.city}
                onChange={(e) =>
                  handleChange('location', {
                    ...formData.location,
                    city: e.target.value,
                  })
                }
              >
                <option value="">Sélectionnez une ville</option>
                {formData.location.country === 'congo' ? (
                  <>
                    <option value="brazzaville">Brazzaville</option>
                    <option value="pointe-noire">Pointe-Noire</option>
                    <option value="dolisie">Dolisie</option>
                  </>
                ) : formData.location.country === 'drc' ? (
                  <>
                    <option value="kinshasa">Kinshasa</option>
                    <option value="lubumbashi">Lubumbashi</option>
                    <option value="goma">Goma</option>
                  </>
                ) : null}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Lieu</Label>
              <Input
                type="text"
                value={formData.location.venue}
                onChange={(e) =>
                  handleChange('location', {
                    ...formData.location,
                    venue: e.target.value,
                  })
                }
                placeholder="Ex: Stade des Martyrs"
              />
            </FormGroup>
            <FormGroup>
              <Label>Adresse complète</Label>
              <Input
                type="text"
                value={formData.location.address}
                onChange={(e) =>
                  handleChange('location', {
                    ...formData.location,
                    address: e.target.value,
                  })
                }
                placeholder="Adresse détaillée du lieu"
              />
            </FormGroup>
            <LocationInputGroup>
              <div className="input-container">
                <Label>Coordonnées GPS </Label>
                <Input
                  type="text"
                  value={formData.location.coordinates}
                  onChange={(e) =>
                    handleChange('location', {
                      ...formData.location,
                      coordinates: e.target.value,
                    })
                  }
                  placeholder="Latitude, Longitude"
                />
              </div>
              <Button className="locate-button">
                <Navigation size={16} />
                Localiser
              </Button>
            </LocationInputGroup>
          </Form>
        );
      case 4:
        return (
          <DateTimeSection>
            <DateTimeHeader>
              <h3>Planification de l'événement</h3>
            </DateTimeHeader>

            <DateTimeContent>
              <DatePickerContainer>
                <InputLabel>
                  <Calendar size={16} />
                  Date de l'événement
                </InputLabel>
                <DateInputWrapper>
                  <InputIcon>
                    <Calendar size={18} />
                  </InputIcon>
                  <StyledInput
                    type="date"
                    value={formData.datetime.date}
                    onChange={(e) =>
                      handleChange('datetime', {
                        ...formData.datetime,
                        date: e.target.value,
                      })
                    }
                  />
                </DateInputWrapper>
              </DatePickerContainer>

              <TimePickerContainer>
                <InputLabel>
                  <Clock size={16} />
                  Heures de l'événement
                </InputLabel>
                <TimeInputsWrapper>
                  <div style={{ position: 'relative' }}>
                    <InputIcon>
                      <Clock size={18} />
                    </InputIcon>
                    <StyledInput
                      type="time"
                      value={formData.datetime.startTime}
                      onChange={(e) =>
                        handleChange('datetime', {
                          ...formData.datetime,
                          startTime: e.target.value,
                        })
                      }
                      placeholder="Début"
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <InputIcon>
                      <Clock size={18} />
                    </InputIcon>
                    <StyledInput
                      type="time"
                      value={formData.datetime.endTime}
                      onChange={(e) =>
                        handleChange('datetime', {
                          ...formData.datetime,
                          endTime: e.target.value,
                        })
                      }
                      placeholder="Fin"
                    />
                  </div>
                </TimeInputsWrapper>
              </TimePickerContainer>
            </DateTimeContent>
          </DateTimeSection>
        );
      case 5:
        return (
          <div>
            <Label>Sélectionnez les types de billets pour cet événement</Label>
            <TicketTypeGrid>
              {ticketTypes.map((type) => (
                <TicketTypeCard
                  key={type.id}
                  selected={formData.selectedTicketTypes.includes(type.id)}
                  onClick={() => handleTicketTypeToggle(type.id)}
                  type="button"
                >
                  <CategoryIcon
                    selected={formData.selectedTicketTypes.includes(type.id)}
                  >
                    <Ticket size={20} />
                  </CategoryIcon>
                  <CategoryName
                    selected={formData.selectedTicketTypes.includes(type.id)}
                  >
                    {type.name}
                  </CategoryName>
                </TicketTypeCard>
              ))}
            </TicketTypeGrid>
          </div>
        );
      case 6:
        return (
          <TicketSection>
            {formData.selectedTicketTypes.map((type) => (
              <TicketCard key={type}>
                <TicketHeader>
                  <TicketTitle>
                    <Ticket />
                    {type === 'carreOr' ? 'Carré Or' : type.toUpperCase()}
                  </TicketTitle>
                </TicketHeader>

                <TicketGrid>
                  <InputGroup>
                    <InputLabel>
                      <Euro size={16} />
                      Prix du billet
                    </InputLabel>
                    <PriceInput>
                      <Euro size={20} />
                      <StyledInputs
                        type="number"
                        value={formData.tickets[type].price}
                        onChange={(e) =>
                          handleChange('tickets', {
                            ...formData.tickets,
                            [type]: {
                              ...formData.tickets[type],
                              price: e.target.value,
                            },
                          })
                        }
                        placeholder="0.00"
                      />
                    </PriceInput>
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>
                      <Users size={16} />
                      Nombre de billets
                    </InputLabel>
                    <StyledInputs
                      type="number"
                      value={formData.tickets[type].quantity}
                      onChange={(e) =>
                        handleChange('tickets', {
                          ...formData.tickets,
                          [type]: {
                            ...formData.tickets[type],
                            quantity: e.target.value,
                          },
                        })
                      }
                      placeholder="Nombre de billets disponibles"
                    />
                  </InputGroup>
                </TicketGrid>

                <InputGroup style={{ marginTop: '2rem' }}>
                  <InputLabel>
                    <Award size={16} />
                    Avantages inclus
                  </InputLabel>
                  <BenefitsContainer>
                    {formData.tickets[type].benefits.map((benefit, index) => (
                      <BenefitInputGroup key={index}>
                        <BenefitInput
                          type="text"
                          value={benefit}
                          onChange={(e) =>
                            handleBenefitChange(type, index, e.target.value)
                          }
                          placeholder="Ajouter un avantage..."
                        />
                        {index ===
                        formData.tickets[type].benefits.length - 1 ? (
                          <IconButton onClick={() => addBenefit(type)}>
                            <Plus size={20} />
                          </IconButton>
                        ) : (
                          <IconButton
                            remove
                            onClick={() => removeBenefit(type, index)}
                          >
                            <Minus size={20} />
                          </IconButton>
                        )}
                      </BenefitInputGroup>
                    ))}
                  </BenefitsContainer>
                </InputGroup>
              </TicketCard>
            ))}
          </TicketSection>
        );
      case 7:
        return (
          <Form>
            {/* Image Upload */}
            <FormGroup>
              <Label>Photo de couverture</Label>
              <UploadContainer
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const event = {
                      target: { files: [file] },
                    };
                    handleFileChange('image', event);
                  }
                }}
                onClick={() => document.getElementById('imageInput').click()}
              >
                {mediaPreviews.image ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={mediaPreviews.image}
                      alt="Aperçu"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                    <IconButton
                      onClick={() => removeMedia('image')}
                      style={{ position: 'absolute', top: '5px', right: '5px' }}
                    >
                      <X size={20} />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto mb-2" />
                    <p>Cliquez ou glissez-déposez une image</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Formats acceptés : JPG, PNG, WEBP (max 10MB)
                    </p>
                  </>
                )}
              </UploadContainer>
              <input
                id="imageInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange('image', e)}
                style={{ display: 'none' }}
              />
            </FormGroup>

            {/* Video Upload */}
            <FormGroup>
              <Label>Vidéo de couverture</Label>
              <UploadContainer
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const event = {
                      target: { files: [file] },
                    };
                    handleFileChange('video', event);
                  }
                }}
                onClick={() => document.getElementById('videoInput').click()}
              >
                {mediaPreviews.video ? (
                  <div style={{ position: 'relative' }}>
                    <video
                      src={mediaPreviews.video}
                      controls
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    ></video>
                    <IconButton
                      onClick={() => removeMedia('video')}
                      style={{ position: 'absolute', top: '5px', right: '5px' }}
                    >
                      <X size={20} />
                    </IconButton>
                  </div>
                ) : (
                  <>
                    <Video className="mx-auto mb-2" />
                    <p>Cliquez ou glissez-déposez une vidéo</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Formats acceptés : MP4, WEBM (max 10MB)
                    </p>
                  </>
                )}
              </UploadContainer>
              <input
                id="videoInput"
                type="file"
                accept="video/mp4,video/webm"
                onChange={(e) => handleFileChange('video', e)}
                style={{ display: 'none' }}
              />
            </FormGroup>
          </Form>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Résumé de l'événement
            </h3>

            <SummarySection>
              <h4>
                <Users size={20} />
                Informations générales
              </h4>
              <div className="content">
                {formData.selectedTicketTypes.map((type) => (
                  <div key={type} className="detail-item">
                    <div className="label">
                      {type === 'carreOr' ? 'Carré Or' : type.toUpperCase()}
                    </div>
                    <div className="value">
                      Prix: {formData.tickets[type].price}€
                    </div>
                    <div className="value">
                      Quantité: {formData.tickets[type].quantity} billets
                    </div>
                    <div className="value text-sm text-gray-400">
                      {formData.tickets[type].benefits.map(
                        (benefit, index) =>
                          benefit && <div key={index}>{benefit}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SummarySection>

            <SummarySection>
              <h4>
                <Award size={20} />
                Catégorie
              </h4>
              <div className="content">
                <div className="detail-item">
                  <div className="value">
                    {categories.find((c) => c.id === formData.category)?.name}
                  </div>
                </div>
              </div>
            </SummarySection>

            <SummarySection>
              <h4>
                <MapPin size={20} />
                Localisation
              </h4>
              <div className="content">
                <div className="detail-item">
                  <div className="label">Lieu</div>
                  <div className="value">{formData.location.venue}</div>
                </div>
                <div className="detail-item">
                  <div className="label">Adresse</div>
                  <div className="value">{formData.location.address}</div>
                </div>
                <div className="detail-item">
                  <div className="label">Ville & Pays</div>
                  <div className="value">
                    {formData.location.city}, {formData.location.country}
                  </div>
                </div>
              </div>
            </SummarySection>

            <SummarySection>
              <h4>
                <Calendar size={20} />
                Date et heure
              </h4>
              <div className="content">
                <div className="detail-item">
                  <div className="label">Date</div>
                  <div className="value">{formData.datetime.date}</div>
                </div>
                <div className="detail-item">
                  <div className="label">Horaires</div>
                  <div className="value">
                    {formData.datetime.startTime} - {formData.datetime.endTime}
                  </div>
                </div>
              </div>
            </SummarySection>

            <SummarySection>
              <h4>
                <Ticket size={20} />
                Billets
              </h4>
              <div className="content">
                {formData.selectedTicketTypes.map((type) => (
                  <div key={type} className="detail-item">
                    <div className="label">
                      {type === 'carreOr' ? 'Carré Or' : type.toUpperCase()}
                    </div>
                    <div className="value">
                      Prix: {formData.tickets[type].price}€
                    </div>
                    <div className="value text-sm text-gray-400">
                      {formData.tickets[type].benefits}
                    </div>
                  </div>
                ))}
              </div>
            </SummarySection>

            <SummarySection>
              <h4>
                <ImageIcon size={20} />
                Médias
              </h4>
              <div className="content">
                <div className="detail-item">
                  <div className="label">Images</div>
                  <div className="value">
                    {formData.media.image
                      ? 'Photo téléchargée'
                      : 'Aucune photo'}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="label">Vidéos</div>
                  <div className="value">
                    {formData.media.video
                      ? 'Vidéo téléchargée'
                      : 'Aucune vidéo'}
                  </div>
                </div>
              </div>
            </SummarySection>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    return () => {
      if (mediaPreviews.image) URL.revokeObjectURL(mediaPreviews.image);
      if (mediaPreviews.video) URL.revokeObjectURL(mediaPreviews.video);
    };
  }, [mediaPreviews.image, mediaPreviews.video]);

  return (
    <>
      <StyledDialog open={open} onClose={onClose} fullScreen>
        <Header>
          <h2>{getStepTitle()}</h2>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>
        <StepperContainer>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
            <Step key={number}>
              <StepCircle active={step === number} completed={step > number}>
                {number}
              </StepCircle>
            </Step>
          ))}
        </StepperContainer>
        <Content>{renderStepContent()}</Content>
        <Footer>
          <Button onClick={handleBack} disabled={step === 1 || isLoading}>
            Retour
          </Button>
          <Button primary onClick={handleNext} disabled={isLoading}>
            {isLoading
              ? 'Création en cours...'
              : step === 8
                ? "Créer l'événement"
                : 'Suivant'}
          </Button>
        </Footer>
        {isError && (
          <>
            <ToastContainer
              position="top-right"
              zIndex={9999}
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              className="custom-toast-container"
            />
            <style jsx global>{`
              .custom-toast-success {
                background-color: #3ecf8e;
                color: white;
                padding: 15px;
                border-radius: 10px;
              }
              .custom-toast-error {
                background-color: #ff4d4d;
                color: white;
                padding: 15px;
                border-radius: 10px;
              }
            `}</style>
          </>
        )}
      </StyledDialog>

      {!isError && (
        <>
          <ToastContainer
            position="top-right"
            zIndex={9999}
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="custom-toast-container"
          />
          <style jsx global>{`
            .custom-toast-success {
              background-color: #3ecf8e;
              color: white;
              padding: 15px;
              border-radius: 10px;
            }
            .custom-toast-error {
              background-color: #ff4d4d;
              color: white;
              padding: 15px;
              border-radius: 10px;
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default EventCreationModal;
