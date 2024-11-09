import { Box, Grid, Typography, Skeleton } from '@mui/material';

const EventSkeleton = () => {
  // Array of 4 items to render skeletons
  const skeletonItems = Array(4).fill(null);

  const SkeletonEventCard = () => (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        backgroundColor: '#131313',
        p: 1,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            height: 'auto',
            aspectRatio: '1 / 1',
            borderRadius: '16px',
            bgcolor: 'grey.895',
          }}
        />
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <Skeleton
            variant="rectangular"
            width={60}
            height={24}
            sx={{
              borderRadius: '6px',
              bgcolor: 'grey.800',
            }}
          />
        </Box>
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            sx={{ bgcolor: 'grey.800' }}
          />
        </Box>
      </Box>
      <Box sx={{ p: 1 }}>
        <Skeleton
          variant="text"
          width="80%"
          height={28}
          sx={{ mb: 1, bgcolor: 'grey.800' }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
            <Skeleton
              variant="circular"
              width={16}
              height={16}
              sx={{ mr: 1, bgcolor: 'grey.800' }}
            />
            <Skeleton variant="text" width="80%" sx={{ bgcolor: 'grey.800' }} />
          </Box>
          <Skeleton variant="text" width="20%" sx={{ bgcolor: 'grey.800' }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Skeleton
            variant="circular"
            width={19}
            height={19}
            sx={{ mr: 1, bgcolor: 'grey.800' }}
          />
          <Skeleton variant="text" width="60%" sx={{ bgcolor: 'grey.800' }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'background.default',
        color: 'text.primary',
        width: '100%',
        marginTop: {
          sm: '100px',
          xs: '95px',
        },
      }}
    >
      <Box sx={{ mt: -10 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Grid
            container
            spacing={1.5}
            sx={{
              maxWidth: {
                xs: '98%',
                sm: '100%',
                md: '100%',
                lg: '100%',
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
            {skeletonItems.map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <SkeletonEventCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default EventSkeleton;
