// src/components/NoEventsMessage.jsx
import { Box, Typography } from '@mui/material';
import { CalendarOff } from 'lucide-react';

const NoEventsMessage = ({ category }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        width: '100%',
        background:
          'linear-gradient(180deg, rgba(35,35,35,0.6) 0%, rgba(19,19,19,0.8) 100%)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <CalendarOff
        size={64}
        style={{
          color: '#3ECF8E',
          marginBottom: '1.5rem',
          opacity: 0.9,
        }}
      />
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          fontWeight: 600,
          marginBottom: '1rem',
          background: 'linear-gradient(90deg, #3ECF8E 0%, #4FA776 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Aucun événement {category.toLowerCase()} pour le moment
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#909090',
          maxWidth: '500px',
          lineHeight: 1.6,
        }}
      >
        Nous n'avons pas encore d'événements dans cette catégorie, mais de
        nouveaux événements sont ajoutés régulièrement. Revenez bientôt pour
        découvrir les dernières nouveautés !
      </Typography>
      <Box
        sx={{
          mt: 4,
          p: 2,
          borderRadius: '12px',
          background: 'rgba(62, 207, 142, 0.1)',
          border: '1px solid rgba(62, 207, 142, 0.2)',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#3ECF8E',
            fontStyle: 'italic',
          }}
        >
          💡 Conseil: Vous pouvez explorer d'autres catégories ou revenir à
          "Tout voir" pour découvrir nos événements disponibles.
        </Typography>
      </Box>
    </Box>
  );
};

export default NoEventsMessage;
