import { Box, Typography, Grid, Alert } from '@mui/material';
import PopularEvents from '../components/PopularEvents';
import Footer from '../components/Footer';
import EventCome from '../components/EventCome';
import { useEvents } from '../features/events/api/queries';
import EventSkeleton from '../components/EventSkeleton';
import PopularEventsSkeleton from '../components/PopularEventsSkeleton';
import AuthModal from '../components/AuthModal';
import { useCategoryStore } from '../features/events/stores/useCategoryStore';

import NoEventsMessage from '../components/NoEventMessage';
import useSearchStore from '../features/events/stores/useSearchStore';
import NoSearchResultsMessage from '../components/NoSearchResultsMessage';

const HomePage = () => {
  const { data: events, isLoading, error } = useEvents();
  const { activeCategory } = useCategoryStore();
  const { searchTerm } = useSearchStore();

  if (isLoading) {
    return (
      <>
        <PopularEventsSkeleton />
        <EventSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="error">Une erreur est survenue</Alert>
      </Box>
    );
  }

  const filteredEvents = events?.filter((event) => {
    const matchesCategory =
      activeCategory === 'Tout voir' || event.category === activeCategory;

    const matchesSearch =
      !searchTerm.trim() ||
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.locationName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });
  const showNoSearchResults =
    searchTerm.trim() && (!filteredEvents || filteredEvents.length === 0);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        color: 'text.primary',
        marginTop: {
          sm: '100px',
          xs: '95px',
        },
      }}
    >
      <AuthModal />
      <Box sx={{ py: 1 }}>
        {activeCategory && !searchTerm && (
          <PopularEvents activeCategory={activeCategory} />
        )}
        {!showNoSearchResults && filteredEvents?.length > 0 && (
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: 2,
              fontWeight: 'bold',
              fontSize: '23px',
              color: '#ffff',
              paddingLeft: {
                md: '5%',
                xs: '5%',
              },
              marginBottom: '0px',
            }}
          >
            {activeCategory !== 'Tout voir'
              ? `${activeCategory} à venir`
              : 'Evenement à venir'}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {showNoSearchResults ? (
            <NoSearchResultsMessage searchTerm={searchTerm} />
          ) : filteredEvents?.length > 0 ? (
            <Grid
              container
              spacing={1.5}
              sx={{
                maxWidth: {
                  xs: '98%',
                  sm: '95%',
                  md: '92%',
                  lg: '92%',
                },
                height: {
                  xs: '100%',
                  sm: '97%',
                  md: '94%',
                  lg: '94%',
                },
                '& .MuiGrid-item': {
                  display: 'flex',
                  justifyContent: 'center',
                },
              }}
            >
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                  <EventCome event={event} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                width: { xs: '90%', sm: '80%', md: '70%' },
                marginTop: '30px',
              }}
            >
              <NoEventsMessage category={activeCategory} />
            </Box>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default HomePage;
