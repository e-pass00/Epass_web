import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Box)(({ theme, variant = 'default' }) => ({
  position: 'relative',
  width: '100%',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgba(62, 207, 142, 0.06)',
  border: '1px solid rgba(62, 207, 142, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  ...(variant === 'destructive' && {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    border: '1px solid rgba(255, 77, 77, 0.2)',
  }),
}));

const StyledAlertTitle = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.2,
}));

const StyledAlertDescription = styled(Typography)(({ theme }) => ({
  color: '#9ca3af',
  fontSize: '13px',
  lineHeight: 1.5,
}));

export const Alert = React.forwardRef(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <StyledAlert ref={ref} variant={variant} {...props}>
        {children}
      </StyledAlert>
    );
  }
);
Alert.displayName = 'Alert';

export const AlertTitle = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <StyledAlertTitle ref={ref} component="h5" {...props}>
      {children}
    </StyledAlertTitle>
  );
});
AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <StyledAlertDescription ref={ref} component="div" {...props}>
        {children}
      </StyledAlertDescription>
    );
  }
);
AlertDescription.displayName = 'AlertDescription';
