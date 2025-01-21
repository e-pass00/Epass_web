import styled from 'styled-components';

import { Dialog } from '@mui/material';

export {
  X,
  ImageIcon,
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
} from 'lucide-react';

export const StyledDialog = styled(Dialog)`
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

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.1rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CloseButton = styled.button`
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

export const StepperContainer = styled.div`
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

export const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
  position: relative;
`;

export const StepCircle = styled.div`
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

export const Content = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.975rem;
  font-weight: 600;
  margin-right: 10px;
`;

export const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  transition: all 0.2s;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #3ecf8e;
  }
`;

export const TextArea = styled.textarea`
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

export const Select = styled.select`
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
  margin-bottom: 10px;

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

export const LocationInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  .input-container {
    width: 100%;
  }

  .locate-button {
    width: fit-content;
  }
`;

export const SummarySection = styled.div`
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

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const CategoryCard = styled.button`
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

export const CategoryIcon = styled.div`
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

export const CategoryName = styled.span`
  color: ${(props) => (props.selected ? '#3ecf8e' : 'white')};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
`;

export const DateTimeSection = styled.div`
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

export const DateTimeHeader = styled.div`
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

export const DateTimeContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const DatePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DateInputWrapper = styled.div`
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

export const TimePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TimeInputsWrapper = styled.div`
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

export const StyledInput = styled.input`
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

export const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TicketTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

export const TicketTypeCard = styled(CategoryCard)`
  padding: 0.75rem;
`;

export const LocationField = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

export const LocationIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

export const Button = styled.button`
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

export const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const UploadContainer = styled.div`
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

export const TicketSection = styled.div`
  margin-bottom: 2rem;
`;

export const TicketCard = styled.div`
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

export const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const TicketTitle = styled.h3`
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

export const TicketGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const PriceInput = styled.div`
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

export const StyledInputs = styled(Input)`
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

export const StyledTextArea = styled(TextArea)`
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

export const InputLabel = styled(Label)`
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

// Utility function for geolocation
export const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      // Here you could update the form state with coordinates
      console.log(`Current location is at: ${latitude}, ${longitude}`);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

export const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

export const PreviewVideo = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;
