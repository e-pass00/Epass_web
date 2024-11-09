import {
  Box,
  Container,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';

const EventsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
}));

const EventCard = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative',
  flexShrink: 0,
  width: '86vw',
  [theme.breakpoints.up('sm')]: {
    width: '35vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '26vw',
  },
  [theme.breakpoints.up('lg')]: {
    width: '16vw',
  },
}));

const PopularEventsSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container
      maxWidth={false}
      disableGutters={isMobile}
      sx={{
        maxWidth: {
          xs: '100%',
          sm: '98%',
          md: '94%',
          lg: '94%',
        },
        mx: 'auto',
        marginTop: {
          sm: '100px',
          xs: '95px',
        },
      }}
    >
      <Box
        paddingTop="10px"
        position="relative"
        sx={{
          backgroundColor: '#131313',
          overflowX: 'hidden',
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          px={isMobile ? 2 : 0}
        >
          <Box display="flex" alignItems="center">
            <Skeleton
              variant="text"
              width={120}
              height={32}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Skeleton
              variant="text"
              width={100}
              height={32}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
            />
          </Box>
        </Box>

        <EventsContainer>
          {[...Array(5)].map((_, index) => (
            <EventCard key={index} sx={{ mr: 2, ml: index === 0 ? 2 : 0 }}>
              <Skeleton
                variant="rectangular"
                sx={{
                  height: {
                    xs: '100vw',
                    sm: '40vw',
                    md: '28vw',
                    lg: '18vw',
                  },
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}
              />
              <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                <Skeleton
                  variant="rectangular"
                  width={60}
                  height={24}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}
                />
              </Box>
              <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                <Skeleton
                  variant="rectangular"
                  width={30}
                  height={40}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}
                />
              </Box>
              <Box
                sx={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}
              >
                <Skeleton
                  variant="text"
                  width="30%"
                  height={32}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Skeleton
                  variant="text"
                  width="80%"
                  height={32}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </Box>
            </EventCard>
          ))}
        </EventsContainer>
      </Box>
    </Container>
  );
};

export default PopularEventsSkeleton;
