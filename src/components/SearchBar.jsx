/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { useEvents } from '../features/events/api/queries';
import useSearchStore from '../features/events/stores/useSearchStore';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '40px',
  backgroundColor: 'transparent',
  border: '2px solid #3ECF8E',

  '&:hover': {
    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
  },
  '&:focus-within': {
    border: '2px solid #008080',
    boxShadow: '0 0 0 2px rgba(0,128,128,0.2)',
  },
  width: '85%',
  [theme.breakpoints.up('sm')]: {
    width: '50%',
  },
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  transition: 'all 0.3s ease-in-out',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 3),
    paddingRight: '40px',
    width: '100%',
    fontSize: '14px',
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  padding: '8px',
  backgroundColor: '#3ECF8E',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#006666',
  },
  borderRadius: '50%',
  position: 'absolute',
  right: '4px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '38px',
  height: '38px',
  minWidth: '38px',
  minHeight: '38px',
}));

const StyledSearchIcon = styled(SearchIcon)({
  fontSize: '19px',
});

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: '16px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#008080',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  color: '#555',
  '&.Mui-selected': {
    color: '#008080',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px', // Réduction de la taille du texte pour les petits écrans
  },
}));

const SearchBar = () => {
  const { data: events } = useEvents();
  const { searchTerm, setSearchTerm, searchEvents } = useSearchStore();

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (events?.data) {
      searchEvents(events.data, term);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      sx={{
        marginTop: {
          xs: '-8px',
          sm: '-55px',
        },
      }}
    >
      <Search>
        <StyledInputBase
          placeholder="Rechercher un événement..."
          value={searchTerm}
          onChange={handleSearch}
          inputProps={{ 'aria-label': 'search' }}
        />
        <SearchButton>
          <StyledSearchIcon />
        </SearchButton>
      </Search>
    </Box>
  );
};

export default SearchBar;
