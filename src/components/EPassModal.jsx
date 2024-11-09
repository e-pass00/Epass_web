/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
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
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';

import { QRCodeSVG } from 'qrcode.react';

import { formatDate, formatTime, handleDownloadTicket } from '../utils/helpers';
import ShareTicketModal from './ShareTicketModal';

const defaultTheme = createTheme();

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
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '-14px',
    width: withHoles ? '26px' : '0',
    height: withHoles ? '26px' : '0',
    backgroundColor: '#2A2A2A',
    borderRadius: '50%',
  },
  '&::before': { left: '-8px' },
  '&::after': { right: '-8px' },
}));

const InfoContainer = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(2),
  margin: `${theme.spacing(1.5)} 0`,
}));

const InfoGroup = styled(Box)(({ align }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: align === 'right' ? 'flex-end' : 'flex-start',
  width: '100%',
}));

const InfoHeader = styled(Box)(({ align }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  marginBottom: '2px',
}));

const InfoLabel = styled(Typography)(({ align }) => ({
  fontSize: '12px',
  color: '#000',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontWeight: 'bold',
  textAlign: align === 'right' ? 'right' : 'left',
}));

const InfoValue = styled(Typography)(({ align }) => ({
  fontSize: '14px',
  color: '#303030',
  fontWeight: 'normal',
  textAlign: align === 'right' ? 'right' : 'left',
}));

const Barcode = styled(Box)(({ theme }) => ({
  height: '60px',
  margin: `${theme.spacing(2)} auto 0`,
  width: '100%',
  backgroundImage: `
    linear-gradient(
      to right,
      ${theme.palette.text.primary} 0px, ${theme.palette.text.primary} 1px, transparent 1px, transparent 3px,
      ${theme.palette.text.primary} 3px, ${theme.palette.text.primary} 4px, transparent 4px, transparent 6px,
      ${theme.palette.text.primary} 6px, ${theme.palette.text.primary} 7px, transparent 7px, transparent 9px,
      ${theme.palette.text.primary} 9px, ${theme.palette.text.primary} 11px, transparent 11px, transparent 15px,
      ${theme.palette.text.primary} 15px, ${theme.palette.text.primary} 18px, transparent 18px, transparent 22px,
      ${theme.palette.text.primary} 22px, ${theme.palette.text.primary} 23px, transparent 23px, transparent 25px,
      ${theme.palette.text.primary} 25px, ${theme.palette.text.primary} 28px, transparent 28px, transparent 32px,
      ${theme.palette.text.primary} 32px, ${theme.palette.text.primary} 33px, transparent 33px, transparent 35px,
      ${theme.palette.text.primary} 35px, ${theme.palette.text.primary} 37px, transparent 37px, transparent 39px,
      ${theme.palette.text.primary} 39px, ${theme.palette.text.primary} 42px, transparent 42px, transparent 46px
    )
  `,
  backgroundSize: '46px 100%',
  backgroundRepeat: 'repeat-x',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: theme.palette.text.primary,
  },
  '&::before': {
    left: 0,
  },
  '&::after': {
    right: 0,
  },
  filter: 'contrast(160%) brightness(90%)',
  borderRadius: theme.shape.borderRadius / 2,
}));

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

const EPassModal = ({ open, onClose, tickets }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showQrCode, setShowQrCode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

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
              <MenuItem onClick={() => handleShareTicket(tickets)}>
                <SendIcon sx={{ marginRight: theme.spacing(1) }} />
                Partager le ticket
              </MenuItem>
              <MenuItem onClick={() => handleDownloadTicket(tickets)}>
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
                  marginBottom: theme.spacing(1),
                  textAlign: 'center',
                  color: 'black',
                }}
              >
                {tickets.eventName}
              </Typography>
              <DashedLine withHoles={false} />
              <InfoContainer>
                <InfoGroup>
                  <InfoHeader>
                    <InfoLabel>DATE</InfoLabel>
                  </InfoHeader>
                  <InfoValue>{formatDate(tickets.startDate)}</InfoValue>
                </InfoGroup>

                <InfoGroup align="right">
                  <InfoHeader align="right">
                    <InfoLabel align="right">HEURE</InfoLabel>
                  </InfoHeader>
                  <InfoValue align="right">
                    {formatTime(tickets.startDate)}
                  </InfoValue>
                </InfoGroup>

                <InfoGroup>
                  <InfoHeader>
                    <InfoLabel>LIEU</InfoLabel>
                  </InfoHeader>
                  <InfoValue>{tickets.locationName}</InfoValue>
                </InfoGroup>

                <InfoGroup align="right">
                  <InfoHeader align="right">
                    <InfoLabel align="right">CATEGORIE</InfoLabel>
                  </InfoHeader>
                  <InfoValue align="right">{tickets.categoryBillet}</InfoValue>
                </InfoGroup>
              </InfoContainer>
              <DashedLine withHoles={true} />
              <Barcode />
            </PassContent>
          </PassContainer>
          <QrButton onClick={handleQrCodeClick}>
            <QrCodeIcon
              sx={{ marginRight: theme.spacing(1), fontSize: '18px' }}
            />
            <Typography fontWeight="bold" fontSize="14px">
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
        </ModalWrapper>
      </Modal>
      {tickets && (
        <ShareTicketModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          ticket={tickets}
        />
      )}
    </ThemeProvider>
  );
};

export default EPassModal;
