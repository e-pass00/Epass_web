import React from 'react';
import styled from 'styled-components';
import {
  Music,
  Mic,
  Theater,
  Tv,
  Award,
  Users,
  Laptop,
  Package,
} from 'lucide-react';

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

const categories = [
  { id: 'Concert', name: 'Concert', icon: Music },
  { id: 'Showcase', name: 'Showcase', icon: Mic },
  { id: 'Sport', name: 'Sport', icon: Award },
  { id: 'Spectacle', name: 'Spectacle', icon: Tv },
  { id: 'Conference', name: 'Conférence', icon: Users },
  { id: 'Technologie', name: 'Technologie', icon: Laptop },
];

const EventCategory = ({ formData, handleChange }) => {
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
};

export default EventCategory;
