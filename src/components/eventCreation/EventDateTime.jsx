import React from 'react';
import styled from 'styled-components';
import { Calendar, Clock } from 'lucide-react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const DateTimeSection = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
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

  input[type='date']::-webkit-calendar-picker-indicator {
    filter: invert(1) brightness(2);
    cursor: pointer;
  }
`;

const TimePickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledDateInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: white;
  font-size: 0.9375rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3ecf8e;
    background: rgba(62, 207, 142, 0.05);
    box-shadow: 0 0 0 3px rgba(62, 207, 142, 0.1);
  }
`;

const TimePickerWrapper = styled.div`
  .react-time-picker {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }

  .react-time-picker__wrapper {
    border: none;
    padding: 0.5rem 1rem;
  }

  .react-time-picker__input input {
    color: white;
    background: transparent;
    border: none;
    font-size: 0.9375rem;
  }
`;

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.975rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventDateTime = ({ formData, handleChange }) => {
  return (
    <DateTimeSection>
      <DateTimeHeader>
        <h3>Planification de l'événement</h3>
      </DateTimeHeader>

      <DateTimeContent>
        <DatePickerContainer>
          <Label>
            <Calendar size={16} color="white" /> Date de l'événement
          </Label>
          <StyledDateInput
            type="date"
            value={formData.datetime.date}
            onChange={(e) =>
              handleChange('datetime', {
                ...formData.datetime,
                date: e.target.value,
              })
            }
          />
        </DatePickerContainer>

        <TimePickerContainer>
          <Label>
            <Clock size={16} /> Heure de début
          </Label>
          <TimePickerWrapper>
            <TimePicker
              onChange={(startTime) =>
                handleChange('datetime', {
                  ...formData.datetime,
                  startTime,
                })
              }
              value={formData.datetime.startTime}
              disableClock={true}
              format="HH:mm"
              clearIcon={null}
            />
          </TimePickerWrapper>
          <Label>
            <Clock size={16} /> Heure de fin (optionnel)
          </Label>
          <TimePickerWrapper>
            <TimePicker
              onChange={(endTime) =>
                handleChange('datetime', {
                  ...formData.datetime,
                  endTime,
                })
              }
              value={formData.datetime.endTime}
              disableClock={true}
              format="HH:mm"
              clearIcon={null}
            />
          </TimePickerWrapper>
        </TimePickerContainer>
      </DateTimeContent>
    </DateTimeSection>
  );
};

export default EventDateTime;
