/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import JsBarcode from 'jsbarcode';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  useMediaQuery,
  useTheme,
  Slide,
  Menu,
  MenuItem,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import { QRCodeSVG } from 'qrcode.react';
import { formatTime, handleDownloadTicket } from '../utils/helpers';
import ShareTicketModal from './ShareTicketModal';

const defaultTheme = createTheme();

// Styled Components
const LoadingBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
  color: '#fff',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: '#fff',
  fontSize: '1rem',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backdropFilter: 'blur(5px)',
}));

const ModalWrapper = styled(Box)(({ theme, isMobile }) => ({
  position: 'absolute',
  top: isMobile ? 0 : '50%',
  left: isMobile ? 0 : '50%',
  zIndex: 9050,
  transform: isMobile ? 'none' : 'translate(-50%, -50%)',
  width: isMobile ? '100%' : '90%',
  height: isMobile ? '100%' : 'auto',
  maxWidth: isMobile ? 'none' : '400px',
  maxHeight: isMobile ? 'none' : '90vh',
  backgroundColor: '#121212',
  display: 'flex',
  flexDirection: 'column',
  color: 'white',
  padding: isMobile ? '0px 0' : theme.spacing(2),
  overflowY: 'auto',
  borderRadius: isMobile ? 0 : theme.shape.borderRadius,
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

const PassContainer = styled(Box)(({ theme, isMobile }) => ({
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

const PassImageContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[5],
}));

const PassImage = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'cover',
  display: 'block',
});

const PassContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[3],
}));

const DashedLine = styled(Box)(({ theme, withHoles }) => ({
  borderTop: `1px dashed ${theme.palette.divider}`,
  margin: `${theme.spacing(1)} -${theme.spacing(2)}`,
  position: 'relative',
  '&::before, &::after': withHoles
    ? {
        content: '""',
        position: 'absolute',
        top: '-14px',
        width: '26px',
        height: '26px',
        backgroundColor: '#2A2A2A',
        borderRadius: '50%',
      }
    : {},
  '&::before': withHoles ? { left: '-8px' } : {},
  '&::after': withHoles ? { right: '-8px' } : {},
}));

const InfoContainer = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1.5),
  margin: `${theme.spacing(1)} 0`,
}));

const InfoGroup = styled(Box)(({ align }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: align === 'right' ? 'flex-end' : 'flex-start',
  width: '100%',
}));

const InfoLabel = styled(Typography)(({ align }) => ({
  fontSize: '13px',
  color: '#000',
  letterSpacing: '0.5px',
  fontWeight: 'bold',
  textAlign: align === 'right' ? 'right' : 'left',
}));

const InfoValue = styled(Typography)(({ align }) => ({
  fontSize: '12px',
  color: '#303030',
  fontWeight: '400',
  textAlign: align === 'right' ? 'right' : 'left',
}));

const BarcodeContainer = styled(Box)(({ theme }) => ({
  margin: `${theme.spacing(1)} auto 0`,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 6px',
  '& canvas': {
    maxWidth: '100%',
    height: '60px !important',
  },
}));

const TicketNumber = styled(Typography)({
  textAlign: 'center',
  fontSize: '11px',
  color: '#000',
  marginTop: '3px',
});

const QrButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#3ECF8E',
  color: theme.palette.getContrastText('#3ECF8E'),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius * 2,
  margin: `${theme.spacing(2)} auto`,
  cursor: 'pointer',
  width: '120px',
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: '#35B67A',
  },
}));

const QrCodeModal = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: theme.shape.borderRadius * 3,
  borderTopRightRadius: theme.shape.borderRadius * 3,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const QrCodeWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
}));

const QrText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginTop: theme.spacing(2),
  fontWeight: 500,
}));

// Helper Functions
const formatDate = (date) => {
  const d = new Date(date);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Jun',
    'Jul',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
};

const formatTicketNumber = (categoryId, number) => {
  return `N°${String(number).padStart(8, '0')}`;
};

// Main Component
const EPassModal = ({ open, onClose, tickets }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showQrCode, setShowQrCode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const barcodeRef = useRef(null);

  const generateBarcode = () => {
    if (barcodeRef.current && tickets.billetId) {
      try {
        const canvas = barcodeRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        JsBarcode(canvas, tickets.billetId, {
          format: 'CODE128',
          width: 2.5,
          height: 50,
          margin: 10,
          background: '#ffffff',
          lineColor: '#000000',
          displayValue: false,
          fontSize: 0,
          textMargin: 0,
          valid: (valid) => {
            if (!valid) {
              console.error('Code-barres invalide');
            }
          },
        });
      } catch (error) {
        console.error('Erreur lors de la génération du code-barres:', error);
      }
    }
  };

  useEffect(() => {
    if (open && tickets.billetId) {
      const timer = setTimeout(() => {
        generateBarcode();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, tickets.billetId]);

  useEffect(() => {
    const handleResize = () => {
      if (open) {
        generateBarcode();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open]);

  const handleQrCodeClick = () => {
    setShowQrCode(true);
  };

  const handleQrCodeClose = () => {
    setShowQrCode(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadWithLoading = async () => {
    setIsDownloading(true);
    try {
      await handleDownloadTicket(tickets);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setErrorMessage(
        'Une erreur est survenue lors du téléchargement. Veuillez réessayer plus tard.'
      );
    } finally {
      setIsDownloading(false);
      handleMenuClose();
    }
  };

  const handleCloseError = () => {
    setErrorMessage('');
  };

  const handleShareTicket = () => {
    setShareModalOpen(true);
    handleMenuClose();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Modal open={open} onClose={onClose}>
        <ModalWrapper isMobile={isMobile}>
          <Header>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
            <Title variant="h6">E-PASS</Title>
            <IconButton sx={{ color: 'white' }} onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleShareTicket}>
                <SendIcon sx={{ marginRight: theme.spacing(1) }} />
                Partager le ticket
              </MenuItem>
              <MenuItem onClick={handleDownloadWithLoading}>
                <DownloadIcon sx={{ marginRight: theme.spacing(1) }} />
                Télécharger le ticket
              </MenuItem>
            </Menu>
          </Header>

          <PassContainer isMobile={isMobile}>
            <PassImageContainer>
              <PassImage src={tickets.coverImage} alt={tickets.eventName} />
            </PassImageContainer>
            <PassContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  marginBottom: theme.spacing(0.5),
                  textAlign: 'center',
                  color: 'black',
                  fontSize: '16px',
                }}
              >
                {tickets.eventName}
              </Typography>

              <DashedLine withHoles={false} />

              <InfoContainer>
                <InfoGroup>
                  <InfoLabel>Date</InfoLabel>
                  <InfoValue>{formatDate(tickets.startDate)}</InfoValue>
                </InfoGroup>

                <InfoGroup align="right">
                  <InfoLabel align="right">Heure</InfoLabel>
                  <InfoValue align="right">
                    {formatTime(tickets.startDate)}
                  </InfoValue>
                </InfoGroup>

                <InfoGroup>
                  <InfoLabel>Lieu</InfoLabel>
                  <InfoValue>{tickets.locationName}</InfoValue>
                </InfoGroup>

                <InfoGroup align="right">
                  <InfoLabel align="right">Catégorie</InfoLabel>
                  <InfoValue align="right">{tickets.categoryBillet}</InfoValue>
                </InfoGroup>
              </InfoContainer>

              <DashedLine withHoles={true} />

              <BarcodeContainer>
                <canvas
                  ref={barcodeRef}
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                  }}
                />
              </BarcodeContainer>

              <TicketNumber>
                {formatTicketNumber(tickets.categoryId, tickets.number)}
              </TicketNumber>
            </PassContent>
          </PassContainer>

          <QrButton onClick={handleQrCodeClick}>
            <QrCodeIcon sx={{ marginRight: 1, fontSize: '16px' }} />
            <Typography fontWeight="bold" fontSize="13px">
              Code QR
            </Typography>
          </QrButton>

          <Modal
            open={showQrCode}
            onClose={handleQrCodeClose}
            closeAfterTransition
          >
            <Slide direction="up" in={showQrCode}>
              <QrCodeModal>
                <QrCodeWrapper>
                  <QRCodeSVG
                    value={tickets.billetId}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000"
                    className="qr-code-element"
                  />
                </QrCodeWrapper>
                <QrText variant="body2">
                  Présentez à l'entrée de l'évènement
                </QrText>
              </QrCodeModal>
            </Slide>
          </Modal>

          {/* Loading Backdrop */}
          <LoadingBackdrop open={isDownloading}>
            <LoadingContainer>
              <CircularProgress color="inherit" size={60} />
              <LoadingText>Génération du ticket en cours...</LoadingText>
            </LoadingContainer>
          </LoadingBackdrop>

          {/* Error Snackbar */}
          <Snackbar
            open={Boolean(errorMessage)}
            autoHideDuration={6000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseError} severity="error" variant="filled">
              {errorMessage}
            </Alert>
          </Snackbar>
        </ModalWrapper>
      </Modal>

      {tickets && (
        <ShareTicketModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          ticket={tickets}
          close={onClose}
        />
      )}
    </ThemeProvider>
  );
};

export default EPassModal;
