/* eslint-disable no-unused-vars */
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  KeyboardArrowUp,
} from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        backgroundColor: " #131313",
        marginTop: "50px",
        color: "#F1F1F1",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "150px",
          background:
            "linear-gradient(165deg, #3ECF8E 25%, transparent 25.5%, transparent 50%, #3ECF8E 50%, #006666 75%, transparent 75.5%, transparent 100%)",
          backgroundSize: "100px 100px",
          opacity: 0.1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#21ad6e", fontWeight: "bold" }}
            >
              Epass
            </Typography>
            <Typography variant="body2" color="#F1F1F1">
              Votre plateforme de billetterie événementielle innovante
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#21ad6e", fontWeight: "bold" }}
            >
              Liens rapides
            </Typography>
            {["Accueil", "Événements", "À propos", "Contact"].map(
              (text, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{
                    display: "block",
                    mb: 1,
                    color: "#F1F1F1",
                    textDecoration: "none",
                    transition: "all 0.3s",
                    "&:hover": {
                      color: "#008080",
                      paddingLeft: "10px",
                    },
                  }}
                >
                  {text}
                </Typography>
              )
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#21ad6e", fontWeight: "bold" }}
            >
              Suivez-nous
            </Typography>
            <Box>
              {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: "#F1F1F1",
                    mr: 1,
                    "&:hover": {
                      backgroundColor: "#21ad6e",
                      transform: "translateY(-3px) rotate(10deg)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Box mt={5} sx={{ position: "relative", textAlign: "center" }}>
          <Typography variant="body2" color="#F1F1F1">
            © {new Date().getFullYear()} Epass. Tous droits réservés.
          </Typography>
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "#21ad6e",
              color: "#F1F1F1",
              "&:hover": {
                backgroundColor: "#006666",
              },
            }}
          >
            <KeyboardArrowUp />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
