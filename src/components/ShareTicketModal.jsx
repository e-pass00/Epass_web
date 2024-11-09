import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Slide,
  Alert,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useTransferTicket } from '../features/events/api/queries';

// Styles existants conservés...
const ModalContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9100,
});

const ModalWrapper = styled(Box)(({ theme, isMobile }) => ({
  position: 'relative',
  width: isMobile ? '100%' : '90%',
  height: isMobile ? '100%' : 'auto',
  maxWidth: '400px',
  maxHeight: isMobile ? '100%' : '90vh',
  backgroundColor: '#121212',
  display: 'flex',
  flexDirection: 'column',
  color: 'white',
  padding: isMobile ? '0px 0' : theme.spacing(2),
  overflowY: 'auto',
  borderRadius: isMobile ? 0 : theme.shape.borderRadius,
  ...(isMobile
    ? {
        height: '100%',
      }
    : {
        margin: 'auto',
      }),
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '10px',
  paddingLeft: '3px',
  marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  flex: 1,
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '2px',
}));

const ShareContainer = styled(Box)(({ theme, isMobile }) => ({
  backgroundColor: '#2A2A2A',
  borderRadius: theme.shape.borderRadius * 4,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  width: '100%',
  maxWidth: '320px',
  padding: isMobile ? '14px' : theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
      borderRadius: theme.shape.borderRadius * 2,
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3ECF8E',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#3ECF8E',
    },
  },
  '& .MuiInputAdornment-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: '#3ECF8E',
  color: theme.palette.getContrastText('#3ECF8E'),
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#35B67A',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(62, 207, 142, 0.3)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: '#2A2A2A',
    color: 'white',
  },
  zIndex: 9200,
}));

const ShareTicketModal = ({ open, onClose, ticket }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [username, setUsername] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const transferMutation = useTransferTicket();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleShareClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmShare = async () => {
    try {
      await transferMutation.mutateAsync({
        billetId: ticket.billetId,
        recipientName: username,
      });

      setSnackbar({
        open: true,
        message: 'Ticket transféré avec succès !',
        severity: 'success',
      });

      setConfirmDialogOpen(false);
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Une erreur est survenue lors du transfert',
        severity: 'error',
      });
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelShare = () => {
    setConfirmDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ModalContainer>
          <Slide direction="up" in={open}>
            <ModalWrapper isMobile={isMobile}>
              <Header>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                  <ArrowBackIcon />
                </IconButton>
                <Title variant="h6">PARTAGER LE TICKET</Title>
                <Box sx={{ width: 40 }} />
              </Header>

              <ShareContainer isMobile={isMobile}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    color: 'white',
                    marginBottom: 2,
                  }}
                >
                  {ticket.eventName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: 3,
                  }}
                >
                  Entrez le nom d'utilisateur de la personne à qui vous
                  souhaitez envoyer ce ticket
                </Typography>

                <StyledTextField
                  fullWidth
                  label="Nom d'utilisateur"
                  variant="outlined"
                  value={username}
                  onChange={handleUsernameChange}
                  InputProps={{
                    startAdornment: (
                      <PersonSearchIcon
                        sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }}
                      />
                    ),
                  }}
                  disabled={transferMutation.isPending}
                />

                <SendButton
                  fullWidth
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleShareClick}
                  disabled={!username.trim() || transferMutation.isPending}
                >
                  {transferMutation.isPending
                    ? 'Envoi en cours...'
                    : 'Envoyer le ticket'}
                </SendButton>
              </ShareContainer>
            </ModalWrapper>
          </Slide>
        </ModalContainer>
      </Modal>

      <StyledDialog
        open={confirmDialogOpen}
        onClose={handleCancelShare}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Confirmation de partage
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            Voulez-vous envoyer le ticket pour "{ticket.eventName}" (
            {ticket.categoryBillet}) à l'utilisateur {username} ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={handleCancelShare}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmShare}
            variant="contained"
            sx={{
              backgroundColor: '#3ECF8E',
              '&:hover': {
                backgroundColor: '#35B67A',
              },
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </StyledDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareTicketModal;
