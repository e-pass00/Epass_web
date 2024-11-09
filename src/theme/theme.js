import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3ECF8E',
    },
    background: {
      default: '#131313',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  ListItemText: {
    fontFamily: 'serif',
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          fontFamily:
            '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
  },
});

export default theme;
