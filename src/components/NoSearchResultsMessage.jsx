import { Box, Typography } from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';

const NoSearchResultsMessage = ({ searchTerm }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '40vh',
      p: 3,
      textAlign: 'center',
    }}
  >
    <SearchIcon
      size={32}
      color="#3ECF8E"
      style={{ opacity: 0.8, marginBottom: '16px' }}
    />
    <Typography
      variant="h6"
      sx={{
        color: '#F1F1F1',
        fontWeight: '500',
        fontSize: '1.1rem',
        mb: 1,
      }}
    >
      Aucun événement trouvé
      {searchTerm && (
        <Box component="span" sx={{ color: '#3ECF8E' }}>
          {' '}
          pour "{searchTerm}"
        </Box>
      )}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        color: '#808080',
        maxWidth: '300px',
      }}
    >
      Essayez d'autres mots-clés ou parcourez nos catégories d'événements
    </Typography>
  </Box>
);

export default NoSearchResultsMessage;
