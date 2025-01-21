import React from 'react';
import styled from 'styled-components';
import { Calendar, Clock } from 'lucide-react';

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

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.975rem;
  font-weight: 600;
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
            <Calendar size={16} /> Date de l'événement
          </Label>
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
          <Label>
            <Clock size={16} /> Heures de l'événement
          </Label>
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
};

export default EventDateTime;
