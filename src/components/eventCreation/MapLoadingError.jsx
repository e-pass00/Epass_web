import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AlertCircle } from 'lucide-react';

const MapLoading = () => (
  <Box
    sx={{
      width: '100%',
      height: { xs: '300px', sm: '350px', md: '400px' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.paper',
      borderRadius: 1,
    }}
  >
    <CircularProgress
      size={60}
      thickness={4}
      sx={{
        color: '#3ECF8E',
        mb: 2,
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        },
      }}
    />
    <Typography
      variant="h6"
      sx={{
        color: '#3ECF8E',
        fontWeight: 500,
        textAlign: 'center',
      }}
    >
      Chargement de la carte...
    </Typography>
  </Box>
);

const MapError = () => (
  <Box
    sx={{
      width: '100%',
      height: { xs: '300px', sm: '350px', md: '400px' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#FEE2E2',
      borderRadius: 1,
      p: 3,
    }}
  >
    <AlertCircle size={60} color="#DC2626" style={{ marginBottom: 16 }} />
    <Typography
      variant="h6"
      sx={{
        color: '#DC2626',
        fontWeight: 600,
        textAlign: 'center',
        mb: 1,
      }}
    >
      Oups ! Une erreur est survenue
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: '#991B1B',
        textAlign: 'center',
        maxWidth: '80%',
      }}
    >
      Impossible de charger la carte. Veuillez vérifier votre connexion internet
      et réessayer.
    </Typography>
  </Box>
);

export { MapLoading, MapError };
