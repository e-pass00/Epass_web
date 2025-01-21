import React from 'react';
import styled from 'styled-components';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import {
  Users,
  Award,
  MapPin,
  Calendar,
  Ticket,
  Image as ImageIcon,
} from 'lucide-react';

// Styled Components
const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
`;
const SummaryTitle = styled(Typography)`
  color: white;
  margin-bottom: 1rem !important; // Réduit de 1.5rem à 1rem
  font-size: 1.3rem !important; // Taille plus petite que h4
  font-weight: 500 !important;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white !important;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3ecf8e;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
`;

const Label = styled(Typography)`
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 0.9rem !important;
`;

const Value = styled(Typography)`
  color: white !important;
  text-align: right;
  font-weight: 500 !important;
`;

const TicketCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    margin-bottom: 0;
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TicketType = styled(Typography)`
  color: #3ecf8e !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
`;

const TicketDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 0.85rem !important;
`;

const DetailValue = styled(Typography)`
  color: white !important;
  font-weight: 600 !important;
  font-size: 1.1rem !important;
`;

const AdvantagesSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const AdvantagesTitle = styled(Typography)`
  color: white !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  margin-bottom: 1rem !important;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;

  &:before {
    content: '•';
    color: #3ecf8e;
    margin-right: 0.75rem;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledChip = styled(Chip)`
  background: ${(props) =>
    props.success
      ? 'rgba(62, 207, 142, 0.1)'
      : 'rgba(255, 255, 255, 0.1)'} !important;
  color: ${(props) =>
    props.success ? '#3ecf8e' : 'rgba(255, 255, 255, 0.7)'} !important;
  border: 1px solid
    ${(props) => (props.success ? '#3ecf8e' : 'rgba(255, 255, 255, 0.1)')} !important;
`;

const EventSummary = ({ formData, mediaPreviews }) => {
  const renderTicketSection = () => (
    <StyledCard elevation={0}>
      <SectionHeader>
        <HeaderIcon>
          <Ticket size={20} />
        </HeaderIcon>
        <Typography variant="h6" style={{ color: 'white' }}>
          Catégories de billets
        </Typography>
      </SectionHeader>

      <CardContent>
        {formData.selectedTicketTypes.map((type) => (
          <TicketCard key={type}>
            <TicketHeader>
              <TicketType>
                {type === 'carreOr' ? 'Carré Or' : type.toUpperCase()}
              </TicketType>
            </TicketHeader>

            <TicketDetails>
              <DetailItem>
                <DetailLabel>Prix unitaire par billet</DetailLabel>
                <DetailValue>{formData.tickets[type].price} €</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Nombre de billets disponibles</DetailLabel>
                <DetailValue>
                  {formData.tickets[type].quantity} billets
                </DetailValue>
              </DetailItem>
            </TicketDetails>

            {formData.tickets[type].benefits.filter((benefit) => benefit.trim())
              .length > 0 && (
              <AdvantagesSection>
                <AdvantagesTitle>
                  Avantages inclus avec ce billet
                </AdvantagesTitle>
                <BenefitsList>
                  {formData.tickets[type].benefits
                    .filter((benefit) => benefit.trim())
                    .map((benefit, idx) => (
                      <BenefitItem key={idx}>{benefit}</BenefitItem>
                    ))}
                </BenefitsList>
              </AdvantagesSection>
            )}
          </TicketCard>
        ))}
      </CardContent>
    </StyledCard>
  );

  const renderGeneralSection = (section) => (
    <StyledCard elevation={0}>
      <SectionHeader>
        <HeaderIcon>
          <section.icon size={20} />
        </HeaderIcon>
        <Typography variant="h6" style={{ color: 'white' }}>
          {section.title}
        </Typography>
      </SectionHeader>

      <CardContent>
        <ContentGrid>
          {section.content.map((item, itemIdx) => (
            <React.Fragment key={itemIdx}>
              <InfoRow>
                <Label>{item.label}</Label>
                {item.status ? (
                  <StyledChip
                    label={item.value}
                    success={item.status === 'success'}
                    size="small"
                  />
                ) : (
                  <Value>{item.value}</Value>
                )}
              </InfoRow>
              {itemIdx < section.content.length - 1 && (
                <Divider style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
              )}
            </React.Fragment>
          ))}
        </ContentGrid>
      </CardContent>
    </StyledCard>
  );

  const sections = [
    {
      title: "Informations de l'événement",
      icon: Users,
      content: [
        { label: "Nom de l'événement", value: formData.name },
        { label: 'Description', value: formData.description },
      ],
    },
    {
      title: 'Catégorie',
      icon: Award,
      content: [
        {
          label: "Type d'événement",
          value:
            formData.category.charAt(0).toUpperCase() +
            formData.category.slice(1),
        },
      ],
    },
    {
      title: 'Localisation',
      icon: MapPin,
      content: [
        { label: 'Lieu', value: formData.location.venue },
        { label: 'Adresse', value: formData.location.address },
        { label: 'Ville', value: formData.location.city },
        { label: 'Pays', value: formData.location.country },
      ],
    },
    {
      title: 'Date et horaires',
      icon: Calendar,
      content: [
        { label: 'Date', value: formData.datetime.date },
        { label: 'Heure de début', value: formData.datetime.startTime },
        {
          label: 'Heure de fin',
          value: formData.datetime.endTime || 'Non spécifié',
        },
      ],
    },
    {
      title: 'Médias',
      icon: ImageIcon,
      content: [
        {
          label: 'Image de couverture',
          value: formData.media.image ? 'Téléchargée' : 'Non téléchargée',
          status: formData.media.image ? 'success' : 'pending',
        },
        {
          label: 'Vidéo',
          value: formData.media.video ? 'Téléchargée' : 'Non téléchargée',
          status: formData.media.video ? 'success' : 'pending',
        },
      ],
    },
  ];

  return (
    <SummaryContainer>
      <SummaryTitle variant="h5" component="h2">
        Récapitulatif de l'événement
      </SummaryTitle>

      {sections.map((section, idx) => renderGeneralSection(section))}
      {renderTicketSection()}
    </SummaryContainer>
  );
};

export default EventSummary;
