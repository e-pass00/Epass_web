import React from 'react';
import { styled, Box, Typography, Paper, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 30px 0 rgba(0, 0, 0, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('xs')]: {
    padding: theme.spacing(1.5),
  },
}));

const IconWrapper = styled(Box)(({ bgColor, theme }) => ({
  backgroundColor: bgColor,
  borderRadius: '50%',
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
    marginRight: '12px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '8px',
    marginRight: '8px',
  },
}));

const MetricHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '12px',
  },
  [theme.breakpoints.down('xs')]: {
    marginBottom: '8px',
  },
}));

const MetricTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  fontFamily: 'sans-serif',
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '0.7rem',
  },
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.30rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: '8px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.15rem',
    marginBottom: '6px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '1rem',
    marginBottom: '4px',
  },
}));

const MetricChange = styled(Typography)(({ theme, positive }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: positive ? '#3ECF8E' : theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '0.75rem',
  },
}));

const colorPalette = {
  yellow: {
    light: 'rgba(255, 193, 7, 0.2)',
    main: 'rgb(255, 193, 7)',
  },
  blue: {
    light: 'rgba(33, 150, 243, 0.2)',
    main: 'rgb(33, 150, 243)',
  },
  green: {
    light: 'rgba(76, 175, 80, 0.2)',
    main: '#3ECF8E',
  },
  red: {
    light: 'rgba(244, 67, 54, 0.2)',
    main: 'rgb(244, 67, 54)',
  },
};

const ArrowIcon = styled(({ positive, ...props }) =>
  positive ? (
    <KeyboardArrowUpIcon {...props} />
  ) : (
    <KeyboardArrowDownIcon {...props} />
  )
)(({ theme }) => ({
  marginRight: '4px',
  fontSize: '20px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    marginRight: '3px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
    marginRight: '2px',
  },
}));

const MetricCard = ({
  title,
  value,
  change,
  Icon,
  color = 'blue',
  positive,
}) => {
  const bgColor = colorPalette[color].light;
  const iconColor = colorPalette[color].main;

  return (
    <StyledPaper elevation={0}>
      <MetricHeader>
        <IconWrapper bgColor={bgColor}>
          <Icon
            sx={{
              color: iconColor,
              fontSize: {
                xs: '18px',
                sm: '20px',
                md: '24px',
              },
            }}
          />
        </IconWrapper>
        <MetricTitle variant="h6">{title}</MetricTitle>
      </MetricHeader>
      <MetricValue variant="h4">{value}</MetricValue>
      <MetricChange positive={positive}>
        <ArrowIcon positive={positive} />
        {change}
      </MetricChange>
    </StyledPaper>
  );
};

export default MetricCard;
