import {
  Dialog,
  DialogContent,
  IconButton,
  InputBase,
  Box,
  Typography,
} from '@mui/material';
import { X as CloseIcon, Search as SearchIcon } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { useEvents } from '../features/events/api/queries';
import useSearchStore from '../features/events/stores/useSearchStore';
import NoSearchResultsMessage from './NoSearchResultsMessage';
import { useNavigate } from 'react-router-dom';

const SearchInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  color: '#F1F1F1',
  '& input': {
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: 'transparent',
    '&::placeholder': {
      color: '#808080',
    },
  },
}));

const SearchResult = ({ event }) => {
  const { closeSearchModal } = useSearchStore();
  const navigate = useNavigate();

  const handleClick = () => {
    closeSearchModal();
    navigate(`events/${event.id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid #292828',
        cursor: 'pointer',
        mx: 2, // Marge horizontale pour l'espacement
        '&:hover': {
          backgroundColor: '#1a1a1a',
        },
      }}
    >
      <Box
        component="img"
        src={event.coverImage}
        sx={{
          width: 80,
          height: 80,
          borderRadius: 1,
          objectFit: 'cover',
        }}
      />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" sx={{ color: '#F1F1F1' }}>
          {event.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#808080' }}>
          {new Date(event.startDate).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Typography>
        <Typography variant="body2" sx={{ color: '#808080' }}>
          {event.locationName}, {event.city}
        </Typography>
      </Box>
    </Box>
  );
};

const SearchModal = () => {
  const { data: events } = useEvents();
  const {
    isModalOpen,
    closeSearchModal,
    searchTerm,
    setSearchTerm,
    searchResults,
    searchEvents,
  } = useSearchStore();

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (events?.data) {
      searchEvents(events.data, term);
    }
  };

  const showNoResults = searchTerm && searchResults.length === 0;

  return (
    <Dialog
      fullScreen
      open={isModalOpen}
      onClose={closeSearchModal}
      PaperProps={{
        sx: {
          backgroundColor: '#131313',
          color: '#F1F1F1',
          '& .MuiDialogContent-root': {
            backgroundColor: '#131313',
            padding: 0,
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #292828',
          backgroundColor: '#131313',
        }}
      >
        <SearchIcon size={20} color="#F1F1F1" />
        <SearchInput
          autoFocus
          placeholder="Rechercher un événement..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <IconButton
          onClick={closeSearchModal}
          sx={{
            color: '#F1F1F1',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon size={20} />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#131313',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#292828',
            borderRadius: '4px',
          },
        }}
      >
        {showNoResults ? (
          <NoSearchResultsMessage searchTerm={searchTerm} />
        ) : (
          searchResults.map((event) => (
            <SearchResult key={event.id} event={event} />
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
