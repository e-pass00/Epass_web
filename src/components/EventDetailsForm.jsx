import React from 'react';
import { FormGroup, Label, Input, TextArea } from '../styles/StyledComponents';

const EventDetailsForm = ({ formData, onFormChange }) => (
  <form>
    <FormGroup>
      <Label>Nom de l'événement</Label>
      <Input
        type="text"
        value={formData.name}
        onChange={(e) => onFormChange('name', e.target.value)}
        placeholder="Ex: Concert de Noël 2024"
      />
    </FormGroup>
    <FormGroup>
      <Label>Description</Label>
      <TextArea
        value={formData.description}
        onChange={(e) => onFormChange('description', e.target.value)}
        placeholder="Décrivez votre événement..."
      />
    </FormGroup>
  </form>
);

export default EventDetailsForm;
