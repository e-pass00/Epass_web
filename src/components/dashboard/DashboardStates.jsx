import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { AlertCircle, Database, Loader } from 'lucide-react';

const BaseDashboardState = ({ children }) => (
  <Paper
    elevation={0}
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'background.default',
      gap: 3,
      p: 4,
    }}
  >
    {children}
  </Paper>
);

export const DashboardLoading = () => (
  <BaseDashboardState>
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress
        size={80}
        thickness={4}
        sx={{
          color: '#3ECF8E',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Loader
        size={40}
        color="#3ECF8E"
        style={{
          position: 'absolute',
          animation: 'pulse 2s infinite',
        }}
      />
    </Box>
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h5"
        sx={{
          color: '#3ECF8E',
          fontWeight: 600,
          mb: 1,
        }}
      >
        Préparation du tableau de bord
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          maxWidth: '400px',
        }}
      >
        Nous récupérons toutes les données de votre événement...
      </Typography>
    </Box>
  </BaseDashboardState>
);

export const DashboardError = () => (
  <BaseDashboardState>
    <Box
      sx={{
        bgcolor: '#FEE2E2',
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
        maxWidth: '500px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: '100px',
          height: '100px',
          bgcolor: '#FEF2F2',
          borderRadius: '50%',
          opacity: 0.6,
        }}
      />
      <AlertCircle
        size={60}
        color="#DC2626"
        style={{ marginBottom: 16, position: 'relative', zIndex: 1 }}
      />
      <Typography
        variant="h5"
        sx={{
          color: '#991B1B',
          fontWeight: 600,
          mb: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Oups ! Quelque chose s'est mal passé
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#7F1D1D',
          mb: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Une erreur est survenue lors du chargement des données. Veuillez
        rafraîchir la page ou réessayer plus tard.
      </Typography>
    </Box>
  </BaseDashboardState>
);

export const DashboardNoData = () => (
  <BaseDashboardState>
    <Box
      sx={{
        bgcolor: '#F0F9FF',
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
        maxWidth: '500px',
        border: '2px dashed #3ECF8E',
      }}
    >
      <Database size={60} color="#3ECF8E" style={{ marginBottom: 16 }} />
      <Typography
        variant="h5"
        sx={{
          color: '#3ECF8E',
          fontWeight: 600,
          mb: 2,
        }}
      >
        Aucune donnée disponible
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 2,
        }}
      >
        Il semble qu'il n'y ait pas encore de données pour cet événement.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontStyle: 'italic',
        }}
      >
        Les données apparaîtront ici dès que l'activité commencera.
      </Typography>
    </Box>
  </BaseDashboardState>
);
