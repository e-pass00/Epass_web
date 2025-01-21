import React from 'react';
import { styled, Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

const EventCardWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 358,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  '&:hover': {
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
  [theme.breakpoints.down('sm')]: {
    height: 280,
  },
}));

const EventImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const Overlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}));

const PopularityContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    width: 60,
    height: 60,
    top: 15,
    right: 15,
  },
}));

const PopularityBorder = styled('div')(({ theme, popularity = 0 }) => ({
  position: 'absolute',
  top: 5,
  left: 5,
  right: 5,
  bottom: 5,
  borderRadius: '50%',
  background: `conic-gradient(
    ${theme.palette.error.main} ${popularity}%, 
    transparent ${popularity}%, 
    transparent 100%
  )`,
  transition: 'background 1s ease-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.8)',
  },
  [theme.breakpoints.down('sm')]: {
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
  },
}));

const HeartPopularity = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  '& svg': {
    width: '100%',
    height: '100%',
    color: theme.palette.error.main,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
  },
  [theme.breakpoints.down('sm')]: {
    width: 45,
    height: 45,
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  marginBottom: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(0.5),
    '& svg': {
      fontSize: '16px',
      marginRight: theme.spacing(0.5),
    },
  },
}));

const LikesCounter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  left: 20,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(0.5),
  },
  [theme.breakpoints.down('sm')]: {
    top: 15,
    left: 15,
    padding: theme.spacing(0.3, 0.8),
    '& svg': {
      fontSize: '16px',
    },
  },
}));

const EventCard = ({
  imageUrl,
  eventName,
  date,
  location,
  likes,
  popularity,
}) => {
  return (
    <EventCardWrapper>
      <EventImage src={imageUrl} alt={eventName} />
      <Overlay>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            marginBottom: { xs: 1, sm: 2 },
          }}
        >
          {eventName}
        </Typography>
        <InfoBox>
          <CalendarTodayIcon />
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {date}
          </Typography>
        </InfoBox>
        <InfoBox>
          <LocationOnIcon />
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {location}
          </Typography>
        </InfoBox>
      </Overlay>
      <PopularityContainer>
        <PopularityBorder popularity={parseFloat(popularity)} />
        <HeartPopularity>
          <FavoriteIcon />
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              color: 'white',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(0,0,0,0.6)',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {popularity}%
          </Typography>
        </HeartPopularity>
      </PopularityContainer>
      <LikesCounter>
        <ThumbUpAltIcon />
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          {likes}
        </Typography>
      </LikesCounter>
    </EventCardWrapper>
  );
};

export default EventCard;
