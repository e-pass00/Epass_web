import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  styled,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close,
  Visibility,
  VisibilityOff,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../features/auth/stores/authStore';

// Styled components
const StyledModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme, isMobile }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: isMobile ? 0 : 8,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  width: isMobile ? '100%' : '400px',
  maxWidth: '100%',
  position: 'relative',
  outline: 'none',
  height: isMobile ? '100vh' : 'auto',
  overflow: 'auto',
}));

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: '#757575',
  border: '1px solid #dadce0',
  padding: '7px 16px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
  },
  '&.Mui-disabled': {
    backgroundColor: '#f5f5f5',
    color: 'rgba(0, 0, 0, 0.26)',
  },
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center',
}));

const SwitchText = styled(Typography)(({ isMobile }) => ({
  textAlign: 'center',
  marginTop: '16px',
  cursor: isMobile ? 'default' : 'pointer',
  '&:hover': {
    textDecoration: isMobile ? 'none' : 'underline',
  },
}));

const ForgotPasswordText = styled(Typography)(({ isMobile }) => ({
  textAlign: 'center',
  marginTop: '8px',
  fontSize: '14px',
  cursor: isMobile ? 'default' : 'pointer',
  '&:hover': {
    textDecoration: isMobile ? 'none' : 'underline',
  },
}));

const LoadingOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1,
});

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const AuthModal = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { signIn, signUp, signInWithGoogle, resetPassword, error, loading } =
    useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const errors = {};

    if (!isLogin && formData.username.trim().length < 3) {
      errors.username =
        "Le nom d'utilisateur doit contenir au moins 3 caractères";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Adresse email invalide';
    }

    if (!isForgotPassword && formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (
      !isLogin &&
      !isForgotPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (isForgotPassword) {
        await resetPassword(formData.email);
        setResetEmailSent(true);
      } else if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.username);
        navigate('/confirm');
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Erreur d'authentification Google:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setFormErrors({});
    setIsGoogleLoading(false);
    setIsForgotPassword(false);
    setResetEmailSent(false);
  };

  // Réinitialiser le formulaire à la fermeture
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Contenu du modal en fonction de l'état (login, inscription, mot de passe oublié)
  const renderContent = () => {
    if (isForgotPassword) {
      return (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => {
                setIsForgotPassword(false);
                setResetEmailSent(false);
              }}
              sx={{ mr: 1 }}
              disabled={loading}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Réinitialiser le mot de passe
            </Typography>
          </Box>

          {resetEmailSent ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Un email de réinitialisation a été envoyé à {formData.email}.
              Veuillez vérifier votre boîte de réception et suivre les
              instructions.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Entrez votre adresse email pour recevoir un lien de
                réinitialisation du mot de passe.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  required
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    background:
                      'linear-gradient(45deg, #2193b0 30%, #3ECF8E 90%)',
                    color: 'white',
                    padding: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      background:
                        'linear-gradient(45deg, #1c7a94 30%, #35b77d 90%)',
                    },
                    '&.Mui-disabled': {
                      background: 'linear-gradient(45deg, #ccc 30%, #ddd 90%)',
                    },
                  }}
                >
                  {loading
                    ? 'Chargement...'
                    : 'Envoyer le lien de réinitialisation'}
                </Button>
              </Form>
            </>
          )}
        </>
      );
    }

    return (
      <>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 3,
          }}
        >
          {isLogin ? 'Connexion' : 'Inscription'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              name="username"
              label="Nom d'utilisateur"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              required
              disabled={loading || isGoogleLoading}
            />
          )}

          <TextField
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
            disabled={loading || isGoogleLoading}
          />

          <TextField
            name="password"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            required
            disabled={loading || isGoogleLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    disabled={loading || isGoogleLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && (
            <TextField
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              required
              disabled={loading || isGoogleLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={loading || isGoogleLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || isGoogleLoading}
            sx={{
              background: 'linear-gradient(45deg, #2193b0 30%, #3ECF8E 90%)',
              color: 'white',
              padding: '8px',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #1c7a94 30%, #35b77d 90%)',
              },
              '&.Mui-disabled': {
                background: 'linear-gradient(45deg, #ccc 30%, #ddd 90%)',
              },
            }}
          >
            {loading
              ? 'Chargement...'
              : isLogin
                ? 'Se connecter'
                : "S'inscrire"}
          </Button>

          {isLogin && (
            <ForgotPasswordText
              isMobile={isMobile}
              variant="body2"
              color="primary"
              onClick={() => {
                if (!loading && !isGoogleLoading) {
                  setIsForgotPassword(true);
                }
              }}
              sx={{
                my: 1,
                pointerEvents: loading || isGoogleLoading ? 'none' : 'auto',
                opacity: loading || isGoogleLoading ? 0.5 : 1,
              }}
            >
              Mot de passe oublié ?
            </ForgotPasswordText>
          )}

          <Divider sx={{ my: 1 }}>ou</Divider>

          <GoogleButton
            fullWidth
            onClick={handleGoogleAuth}
            disabled={loading || isGoogleLoading}
          >
            <GoogleIcon />
            {isGoogleLoading
              ? 'Connexion en cours...'
              : 'Continuer avec Google'}
          </GoogleButton>
        </Form>

        <SwitchText
          isMobile={isMobile}
          variant="body2"
          color="primary"
          onClick={() => {
            if (!loading && !isGoogleLoading) {
              setIsLogin(!isLogin);
              resetForm();
            }
          }}
          sx={{
            mt: 3,
            pointerEvents: loading || isGoogleLoading ? 'none' : 'auto',
            opacity: loading || isGoogleLoading ? 0.5 : 1,
          }}
        >
          {isLogin
            ? "Pas encore de compte ? S'inscrire"
            : 'Déjà un compte ? Se connecter'}
        </SwitchText>
      </>
    );
  };

  return (
    <StyledModal
      open={open}
      onClose={() => {
        if (!loading && !isGoogleLoading) {
          onClose();
          resetForm();
        }
      }}
      sx={{
        alignItems: isMobile ? 'flex-start' : 'center',
      }}
    >
      <ModalContent isMobile={isMobile}>
        {(loading || isGoogleLoading) && (
          <LoadingOverlay>
            <CircularProgress />
          </LoadingOverlay>
        )}

        <IconButton
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
          onClick={() => {
            if (!loading && !isGoogleLoading) {
              onClose();
              resetForm();
            }
          }}
          disabled={loading || isGoogleLoading}
        >
          <Close />
        </IconButton>

        {renderContent()}
      </ModalContent>
    </StyledModal>
  );
};

export default AuthModal;
