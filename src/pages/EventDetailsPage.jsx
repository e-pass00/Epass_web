import { useParams } from 'react-router-dom';
import { useEvent } from '../features/events/api/queries';
import ArtistProfile from '../components/ArtistProfile';
import { CircularProgress, Box, Typography } from '@mui/material';

const EventDetailsPage = () => {
  const { id } = useParams();

  // Vérification que l'ID existe
  if (!id) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">ID de l'événement manquant</Typography>
      </Box>
    );
  }

  const { data: event, isLoading, error } = useEvent(id);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">
          {error instanceof Error
            ? error.message
            : "Erreur lors du chargement de l'événement"}
        </Typography>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography>Événement non trouvé</Typography>
      </Box>
    );
  }
  console.log(event);
  console.log('detail-----------------');
  return <ArtistProfile event={event} />;
};

export default EventDetailsPage;
