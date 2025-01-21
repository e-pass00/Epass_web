import React from 'react';
import styled from 'styled-components';

import { Ticket, Award, Users, Plus, Minus } from 'lucide-react';

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

const StyledInputs = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 3rem;
  transition: all 0.2s ease;
  padding: 0 1rem;
  color: white;
  font-weight: 600;

  &:focus {
    border-color: #3ecf8e;
    box-shadow: 0 0 0 2px rgba(62, 207, 142, 0.2);
    background: rgba(62, 207, 142, 0.05);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-weight: normal;
  }
`;
const InputLabel = styled.label`
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

const TicketConfiguration = ({
  formData,
  handleChange,
  handleBenefitChange,
  addBenefit,
  removeBenefit,
}) => {
  return (
    <TicketSection>
      {formData.selectedTicketTypes.map((type) => (
        <TicketCard key={type}>
          <TicketHeader>
            <TicketTitle>
              <Ticket /> {type === 'carreOr' ? 'Carré Or' : type.toUpperCase()}
            </TicketTitle>
          </TicketHeader>

          <TicketGrid>
            <InputGroup>
              <InputLabel>
                <Euro size={16} /> Prix du billet
              </InputLabel>
              <PriceInput>
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
                  placeholder="0.00 FCFA"
                />
              </PriceInput>
            </InputGroup>

            <InputGroup>
              <InputLabel>
                <Users size={16} /> Nombre de billets
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
              <Award size={16} /> Avantages inclus
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
                  {index === formData.tickets[type].benefits.length - 1 ? (
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
};

export default TicketConfiguration;
