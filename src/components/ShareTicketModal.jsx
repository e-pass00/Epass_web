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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTransferTicket } from '../features/events/api/queries';

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9100,
}));

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
  borderRadius: isMobile ? 0 : 8,
  ...(isMobile
    ? {
        height: '100%',
      }
    : {
        margin: 'auto',
      }),
}));

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '10px',
  paddingLeft: '3px',
  marginBottom: '16px',
});

const Title = styled(Typography)({
  flex: 1,
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '2px',
});

const ShareContainer = styled(Box)(({ theme, isMobile }) => ({
  backgroundColor: '#2A2A2A',
  borderRadius: 32,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  width: '100%',
  maxWidth: '320px',
  padding: isMobile ? '14px' : '16px',
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(211, 47, 47, 0.1)',
  borderRadius: 16,
  padding: '12px 16px',
  marginTop: '16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  border: '1px solid rgba(211, 47, 47, 0.3)',
  animation: 'fadeIn 0.3s ease-in-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}));

const ErrorIcon = styled(ErrorOutlineIcon)({
  color: '#ff4444',
  fontSize: 24,
  marginTop: '2px',
});

const StyledTextField = styled(TextField)({
  marginTop: '24px',
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
      borderRadius: 16,
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
});

const SendButton = styled(Button)({
  marginTop: '32px',
  backgroundColor: '#3ECF8E',
  color: 'black',
  padding: '12px 24px',
  borderRadius: 16,
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
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    color: 'white',
  },
  zIndex: 9200,
});

const SuccessContainer = styled(Box)(({ theme, isMobile }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#121212',
  zIndex: 1,
  animation: 'fadeIn 0.3s ease-in-out',
  padding: isMobile ? '16px' : '32px',
  width: '100%',
  height: isMobile ? '80%' : '100%',
  minHeight: isMobile ? 'auto' : '400px',
  borderRadius: isMobile ? 0 : 8,
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

const SuccessIcon = styled(CheckCircleIcon)({
  color: '#3ECF8E',
  fontSize: 80,
  marginBottom: '16px',
  animation: 'scaleIn 0.5s ease-out',
  '@keyframes scaleIn': {
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' },
  },
});

const ShareTicketModal = ({ open, onClose, ticket, close }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [username, setUsername] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const transferMutation = useTransferTicket();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (error) setError(null);
  };

  const handleShareClick = () => {
    setConfirmDialogOpen(true);
  };

  const getErrorMessage = (error) => {
    switch (error?.error) {
      case 'TRANSFER_LIMIT_EXCEEDED':
        return 'Ce billet a atteint le nombre limite de transferts (5).';
      case 'TICKET_ALREADY_SCANNED':
        return 'Impossible de transférer un billet déjà scanné.';
      case 'SELF_TRANSFER':
        return 'Vous ne pouvez pas transférer le billet à vous-même.';
      case 'RECIPIENT_NOT_FOUND':
        return "L'utilisateur spécifié n'a pas été trouvé.";
      case 'UNAUTHORIZED_ACTION':
        return 'Vous ne pouvez transférer que votre propre billet.';
      case 'MISSING_PARAMETERS':
        return 'Informations manquantes pour le transfert.';
      case 'NETWORK_ERROR':
        return 'Erreur de connexion. Vérifiez votre connexion internet.';
      case 'AUTH_ERROR':
        return "Erreur d'authentification. Veuillez vous reconnecter.";
      default:
        return error?.message || 'Une erreur est survenue lors du transfert.';
    }
  };

  const handleConfirmShare = async () => {
    try {
      await transferMutation.mutateAsync({
        billetId: ticket.billetId,
        recipientName: username,
      });

      setConfirmDialogOpen(false);
      setError(null);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, 4000);
      close();
    } catch (err) {
      setConfirmDialogOpen(false);
      setError(getErrorMessage(err));
    }
  };

  const handleCancelShare = () => {
    setConfirmDialogOpen(false);
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
          height: '100%',
          width: '100%',
        }}
      >
        <ModalContainer>
          <Slide direction="up" in={open} sx={{ height: '100%' }}>
            <ModalWrapper isMobile={isMobile}>
              {showSuccess ? (
                <SuccessContainer isMobile={isMobile}>
                  <SuccessIcon />
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#3ECF8E',
                      mb: 1,
                      fontSize: isMobile ? '1.25rem' : '1.5rem',
                    }}
                  >
                    Transfert réussi !
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: isMobile ? '1rem' : '1.15rem',
                    }}
                  >
                    Le ticket a été envoyé à {username}
                  </Typography>
                </SuccessContainer>
              ) : (
                <>
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
                      error={!!error}
                      disabled={transferMutation.isPending}
                    />

                    {error && (
                      <ErrorContainer>
                        <ErrorIcon />
                        <Typography
                          variant="body2"
                          sx={{ color: '#ff4444', flex: 1 }}
                        >
                          {error}
                        </Typography>
                      </ErrorContainer>
                    )}

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
                </>
              )}
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
    </>
  );
};

export default ShareTicketModal;
