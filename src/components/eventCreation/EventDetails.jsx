import React from 'react';
import styled from 'styled-components';

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

const EventDetails = ({ formData, handleChange }) => {
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
};

export default EventDetails;
