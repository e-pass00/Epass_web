import React from 'react';
import styled from 'styled-components';
import { Ticket } from 'lucide-react';

const TicketTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

const CategoryCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${(props) =>
    props.selected ? 'rgba(62, 207, 142, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid
    ${(props) => (props.selected ? '#3ecf8e' : 'rgba(255, 255, 255, 0.1)')};
  border-radius: 8px;
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

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.975rem;
  font-weight: 600;
`;

const ticketTypes = [
  { id: 'standard', name: 'Standard' },
  { id: 'vip', name: 'VIP' },
  { id: 'vvip', name: 'VVIP' },
  { id: 'carreOr', name: 'Carré Or' },
];

const TicketTypes = ({ formData, handleTicketTypeToggle }) => {
  return (
    <div>
      <Label>Sélectionnez les types de billets pour cet événement</Label>
      <TicketTypeGrid>
        {ticketTypes.map((type) => (
          <CategoryCard
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
          </CategoryCard>
        ))}
      </TicketTypeGrid>
    </div>
  );
};

export default TicketTypes;
