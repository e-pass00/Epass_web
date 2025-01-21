import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  X as XIcon,
} from 'lucide-react';
import { styled, keyframes } from '@mui/material/styles';
import { useReserveTickets } from '../features/events/api/queries';
import momo from '../assets/momo.jpg';
import airtel from '../assets/airtel.png';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-container': {
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiDialog-paper': {
    backgroundColor: '#000201',
    margin: 0,
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    borderRadius: 0,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '420px',
      margin: 'auto',
      height: '95vh',
      maxHeight: '95vh',
      borderRadius: '24px',
      transform: 'none',
    },
  },
}));

const DialogHeader = styled(Box)({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
});

const ScrollableContent = styled(DialogContent)({
  padding: '0 16px 100px 16px',
  overflowY: 'auto',
  marginTop: '8px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const EventDetails = styled(Box)({
  display: 'flex',
  gap: '12px',
  marginBottom: '30px',
  height: '80px',
  padding: '12px',
  borderRadius: '12px',
});

const EventImage = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '12px',
  flexShrink: 0,
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const EventInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
});

const EventTitle = styled(Typography)({
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '4px',
  lineHeight: 1.2,
});

const DetailRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#9ca3af',
  fontSize: '12px',
  '& svg': {
    width: 14,
    height: 14,
    color: '#9ca3af',
  },
});

const OrderSummaryCard = styled(Box)({
  backgroundColor: 'rgba(62, 207, 142, 0.06)',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '24px',
  border: '1px solid rgba(62, 207, 142, 0.08)',
});

const SummaryRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
  '&:last-child': {
    marginBottom: 0,
  },
});

const PaymentMethodCard = styled(Box)({
  backgroundColor: 'rgba(62, 207, 142, 0.06)',
  border: '1px solid rgba(62, 207, 142, 0.08)',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
  position: 'relative',
  minHeight: '80px',
});

const MethodCard = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    transform: 'translateY(-2px)',
  },
  '&.selected': {
    borderColor: '#3ECF8E',
    backgroundColor: 'rgba(62, 207, 142, 0.06)',
  },
});

const MethodContent = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  position: 'relative',
});

const MethodTextContent = styled(Box)({
  paddingRight: '76px',
});

const MethodLogo = styled(Box)({
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  '& img': {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  },
});

const PhoneInputWrapper = styled(Box)({
  marginTop: '24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.15)',
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

const ValidationMessage = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#ff4d4d',
  fontSize: '12px',
  marginTop: '8px',
});

const BottomBar = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  padding: '16px',
  borderTop: '1px solid rgba(62, 207, 142, 0.15)', // Bordure plus claire (augmenté de 0.1 à 0.15)
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: '20px 20px 0 0',
  alignItems: 'center',
  backdropFilter: 'blur(12px)',
  [theme.breakpoints.up('sm')]: {
    position: 'absolute',
    maxWidth: '420px',
    width: '100%',
    left: 0,
    transform: 'none',
  },
}));
const PayButton = styled('button')({
  backgroundColor: '#3ECF8E',
  color: '#000000',
  border: 'none',
  borderRadius: '24px',
  padding: '14px 36px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#2eb77c',
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
    cursor: 'not-allowed',
    transform: 'none',
  },
});

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ResultContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px',
  textAlign: 'center',
  animation: `${fadeIn} 0.5s ease-out`,
});

const IconWrapper = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  '&.success': {
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
    color: '#3ECF8E',
  },
  '&.error': {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    color: '#ff4d4d',
  },
});

const ErrorMessage = styled(Box)({
  backgroundColor: 'rgba(255, 77, 77, 0.1)',
  border: '1px solid rgba(255, 77, 77, 0.2)',
  borderRadius: '12px',
  padding: '16px',
  marginTop: '16px',
  color: '#ff4d4d',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
});

const PAYMENT_METHODS = {
  momopay: {
    name: 'MomoPay',
    description: 'Paiement rapide et sécurisé via MTN MoMo',
    image: momo,
    prefix: '06',
    color: '#FFD100',
    regex: /^06\d{7}$/,
    systemCode: 'MomoPay',
  },
};

const validatePhoneNumber = (number, method) => {
  if (!number) return false;
  const cleanNumber = number.replace(/\s/g, '');
  return PAYMENT_METHODS[method].regex.test(cleanNumber);
};

const formatPhoneNumber = (number) => {
  const clean = number.replace(/\D/g, '');
  const match = clean.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return number;
};

const PurchaseSummaryModal = ({
  open,
  onClose,
  event,
  tickets,
  quantities,
}) => {
  const [step, setStep] = useState('summary');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const navigate = useNavigate();

  const reserveTicketsMutation = useReserveTickets();

  const subtotal = Object.entries(quantities).reduce(
    (sum, [categoryId, quantity]) => {
      const category = tickets.find((cat) => cat.id === categoryId);
      return sum + (category ? quantity * category.price : 0);
    },
    0
  );

  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const handleBack = () => {
    if (step === 'phone-input') {
      setStep('method-selection');
    } else if (step === 'method-selection') {
      setStep('summary');
    } else if (['success', 'error'].includes(step)) {
      onClose();
    } else {
      onClose();
    }
  };

  const getPaymentSystemCode = (method) => {
    console.log('Payment method received:', method);
    const systemCode = PAYMENT_METHODS[method]?.systemCode;
    console.log('System code to be sent:', systemCode);
    return systemCode;
  };

  const handlePayment = async () => {
    const ticketsData = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([categoryId, quantity]) => ({
        categoryId,
        quantity,
      }));

    const paymentSystem = getPaymentSystemCode(selectedMethod);
    console.log('Selected method:', selectedMethod);
    console.log('Payment system to be sent:', paymentSystem);

    try {
      const payload = {
        eventId: event.id,
        tickets: ticketsData,
        paymentSystem,
        phoneNumber: phoneNumber.replace(/\s/g, ''),
      };

      console.log('Full payload being sent:', payload);

      await reserveTicketsMutation.mutateAsync(payload);
      setStep('success');
    } catch (error) {
      console.error('Payment error details:', error);
      setStep('error');
    }
  };
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setPhoneNumber('');
    setFormattedPhone('');
    setPhoneError('');
    setStep('phone-input');
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhoneNumber(value);
    setFormattedPhone(formatPhoneNumber(value));

    if (value.length === 9) {
      const isValid = validatePhoneNumber(value, selectedMethod);
      if (!isValid) {
        const method = PAYMENT_METHODS[selectedMethod];
        const prefixText = Array.isArray(method.prefix)
          ? `${method.prefix.join(' ou ')}`
          : method.prefix;
        setPhoneError(`Le numéro doit commencer par ${prefixText}`);
      } else {
        setPhoneError('');
      }
    } else if (value.length > 0) {
      setPhoneError('Le numéro doit contenir 9 chiffres');
    } else {
      setPhoneError('');
    }
  };

  const handlePhoneSubmit = () => {
    if (!phoneError && phoneNumber.length === 9) {
      setStep('summary');
    }
  };

  const renderPaymentMethodSelection = () => (
    <>
      <Typography
        sx={{ color: 'white', fontSize: '18px', fontWeight: 600, mb: 3 }}
      >
        Choisissez votre méthode de paiement
      </Typography>

      <RadioGroup value={selectedMethod}>
        {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
          <MethodCard
            key={key}
            className={selectedMethod === key ? 'selected' : ''}
            onClick={() => handleMethodSelect(key)}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                width: '100%',
              }}
            >
              <MethodLogo
                style={{
                  backgroundColor: method.color,
                  position: 'static',
                  marginTop: '43px',
                }}
              >
                <img src={method.image} alt={method.name} />
              </MethodLogo>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {method.name}
                </Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '13px' }}>
                  {method.description}
                </Typography>
              </Box>
              <Radio
                checked={selectedMethod === key}
                sx={{
                  color: '#3ECF8E',
                  '&.Mui-checked': {
                    color: '#3ECF8E',
                  },
                }}
              />
            </Box>
          </MethodCard>
        ))}
      </RadioGroup>
    </>
  );

  const renderPhoneInput = () => {
    const selectedPaymentMethod = PAYMENT_METHODS[selectedMethod];

    return (
      <>
        <Typography
          sx={{ color: 'white', fontSize: '18px', fontWeight: 600, mb: 3 }}
        >
          Entrez votre numéro de téléphone
        </Typography>

        <PaymentMethodCard>
          <MethodContent>
            <MethodTextContent>
              <Typography
                sx={{ color: 'white', fontSize: '16px', fontWeight: 500 }}
              >
                {selectedPaymentMethod.name}
              </Typography>
              <Typography sx={{ color: '#9ca3af', fontSize: '13px', mt: 0.5 }}>
                {selectedPaymentMethod.description}
              </Typography>
            </MethodTextContent>
            <MethodLogo
              style={{ backgroundColor: selectedPaymentMethod.color }}
            >
              <img
                src={selectedPaymentMethod.image}
                alt={selectedPaymentMethod.name}
              />
            </MethodLogo>
          </MethodContent>
        </PaymentMethodCard>

        <PhoneInputWrapper>
          <StyledTextField
            fullWidth
            label="Numéro de téléphone"
            variant="outlined"
            value={formattedPhone}
            onChange={handlePhoneChange}
            placeholder={`Ex: ${selectedPaymentMethod.prefix}XXXXXXX`}
            error={!!phoneError}
          />
          {phoneError && (
            <ValidationMessage>
              <AlertCircle size={14} />
              {phoneError}
            </ValidationMessage>
          )}
        </PhoneInputWrapper>

        <PayButton
          onClick={handlePhoneSubmit}
          disabled={!phoneNumber || phoneError}
          style={{ marginTop: '32px', width: '100%' }}
        >
          Continuer
        </PayButton>
      </>
    );
  };

  const renderSummary = () => (
    <>
      <EventDetails>
        <EventImage>
          <img src={event?.coverImage} alt={event?.name} />
        </EventImage>
        <EventInfo>
          <EventTitle>{event?.name}</EventTitle>
          <Box>
            <DetailRow>
              <Calendar /> Ven, 20 Decembre
            </DetailRow>
            <DetailRow>
              <Clock /> 19h00 - 22h00
            </DetailRow>
            <DetailRow>
              <MapPin /> Palais des Congrès
            </DetailRow>
          </Box>
        </EventInfo>
      </EventDetails>

      <OrderSummaryCard>
        <Typography
          sx={{ color: 'white', fontSize: '15px', fontWeight: 500, mb: 2 }}
        >
          Résumé de la commande
        </Typography>

        {tickets?.map(
          (ticket) =>
            quantities[ticket.id] > 0 && (
              <SummaryRow key={ticket.id}>
                <Box>
                  <Typography
                    sx={{ color: 'white', fontSize: '13px', fontWeight: 500 }}
                  >
                    {ticket.name}
                  </Typography>
                  <Typography sx={{ color: '#3ECF8E', fontSize: '12px' }}>
                    x{quantities[ticket.id]}
                  </Typography>
                </Box>
                <Typography
                  sx={{ color: 'white', fontSize: '13px', fontWeight: 500 }}
                >
                  {(ticket.price * quantities[ticket.id]).toLocaleString()} XAF
                </Typography>
              </SummaryRow>
            )
        )}

        <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.08)', my: 2 }} />

        <SummaryRow>
          <Typography sx={{ color: '#9ca3af', fontSize: '13px' }}>
            Sous-total
          </Typography>
          <Typography sx={{ color: 'white', fontSize: '13px' }}>
            {subtotal.toLocaleString()} XAF
          </Typography>
        </SummaryRow>

        <SummaryRow>
          <Typography sx={{ color: '#9ca3af', fontSize: '13px' }}>
            Frais de service (10%)
          </Typography>
          <Typography sx={{ color: 'white', fontSize: '13px' }}>
            {serviceFee.toLocaleString()} XAF
          </Typography>
        </SummaryRow>

        <Box sx={{ height: '1px', bgcolor: 'rgba(255,255,255,0.08)', my: 2 }} />

        <SummaryRow>
          <Typography
            sx={{ color: 'white', fontSize: '15px', fontWeight: 500 }}
          >
            Total
          </Typography>
          <Typography
            sx={{ color: '#3ECF8E', fontSize: '15px', fontWeight: 500 }}
          >
            {total.toLocaleString()} XAF
          </Typography>
        </SummaryRow>
      </OrderSummaryCard>

      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            sx={{ color: 'white', fontSize: '15px', fontWeight: 500 }}
          >
            Paiement
          </Typography>
          <Typography
            sx={{ color: '#3ECF8E', fontSize: '12px', cursor: 'pointer' }}
            onClick={() => setStep('method-selection')}
          >
            {selectedMethod ? 'Changer de méthode >' : 'Ajouter une méthode >'}
          </Typography>
        </Box>

        {selectedMethod && (
          <PaymentMethodCard>
            <MethodContent>
              <MethodTextContent>
                <Typography
                  sx={{ color: 'white', fontSize: '14px', fontWeight: 500 }}
                >
                  {PAYMENT_METHODS[selectedMethod].name}
                </Typography>
                <Typography
                  sx={{ color: '#9ca3af', fontSize: '12px', mt: 0.5 }}
                >
                  +242 {formattedPhone}
                </Typography>
              </MethodTextContent>
              <MethodLogo
                style={{
                  backgroundColor: PAYMENT_METHODS[selectedMethod].color,
                }}
              >
                <img
                  src={PAYMENT_METHODS[selectedMethod].image}
                  alt={PAYMENT_METHODS[selectedMethod].name}
                />
              </MethodLogo>
            </MethodContent>
          </PaymentMethodCard>
        )}
      </Box>
    </>
  );

  const renderResult = () => {
    if (step === 'success') {
      return (
        <ResultContainer>
          <IconWrapper className="success">
            <CheckCircle size={40} />
          </IconWrapper>
          <Typography
            sx={{ color: 'white', fontSize: '24px', fontWeight: 600, mb: 2 }}
          >
            Réservation réussie !
          </Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: '16px', mb: 4 }}>
            Vos tickets sont maintenant disponibles dans la section "Mes
            Tickets"
          </Typography>
          <PayButton onClick={() => navigate('/tickets')}>
            Voir mes tickets
          </PayButton>
        </ResultContainer>
      );
    }

    if (step === 'error') {
      return (
        <ResultContainer>
          <IconWrapper className="error">
            <XIcon size={40} />
          </IconWrapper>
          <Typography
            sx={{ color: 'white', fontSize: '24px', fontWeight: 600, mb: 2 }}
          >
            Échec de la réservation
          </Typography>
          <ErrorMessage>
            <AlertCircle size={20} />
            <Typography>
              {reserveTicketsMutation.error?.message ||
                'Une erreur est survenue lors de la réservation.'}
            </Typography>
          </ErrorMessage>
          <PayButton onClick={() => setStep('summary')} sx={{ mt: 4 }}>
            Réessayer
          </PayButton>
        </ResultContainer>
      );
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullScreen>
      <DialogHeader>
        <IconButton
          onClick={handleBack}
          sx={{ color: 'white', padding: 1, marginLeft: '-8px' }}
        >
          <ArrowLeft size={20} />
        </IconButton>
        <Typography sx={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>
          {step === 'method-selection'
            ? 'Méthode de paiement'
            : step === 'phone-input'
              ? 'Numéro de téléphone'
              : step === 'success'
                ? 'Confirmation'
                : step === 'error'
                  ? 'Erreur'
                  : 'Détails de la réservation'}
        </Typography>
      </DialogHeader>

      <ScrollableContent>
        {step === 'method-selection' && renderPaymentMethodSelection()}
        {step === 'phone-input' && renderPhoneInput()}
        {step === 'summary' && renderSummary()}
        {['success', 'error'].includes(step) && renderResult()}
      </ScrollableContent>

      {step === 'summary' && (
        <BottomBar>
          <Box>
            <Typography sx={{ color: '#9ca3af', fontSize: '12px' }}>
              Total à payer
            </Typography>
            <Typography
              sx={{ color: '#3ECF8E', fontSize: '16px', fontWeight: 'bold' }}
            >
              {total.toLocaleString()} XAF
            </Typography>
          </Box>
          <PayButton
            disabled={!selectedMethod || reserveTicketsMutation.isLoading}
            onClick={handlePayment}
          >
            {reserveTicketsMutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Payer maintenant'
            )}
          </PayButton>
        </BottomBar>
      )}
    </StyledDialog>
  );
};

export default PurchaseSummaryModal;
