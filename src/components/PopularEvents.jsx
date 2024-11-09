/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  styled,
  Container,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";

const OuterContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "40px", // Ajustez cette valeur selon vos besoins
    pointerEvents: "none",
    zIndex: 1,
  },
  "&::before": {
    left: 0,
    background: "linear-gradient(to right,  #131313, rgba(18,18,18,0))",
  },
  "&::after": {
    right: 0,
    background: "linear-gradient(to left,  #131313, rgba(18,18,18,0))",
  },
}));
const EventsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  scrollBehavior: "smooth",
  position: "relative",
  cursor: "grab",
  backgroundColor: "transparent",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
}));

const EventCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  position: "relative",
  flexShrink: 0,
  backgroundColor: "#1E1E1E",
  width: "86vw",

  [theme.breakpoints.up("sm")]: {
    width: "35vw",
  },
  [theme.breakpoints.up("md")]: {
    width: "26vw",
  },
  [theme.breakpoints.up("lg")]: {
    width: "16vw",
  },
}));

const EventImage = styled(CardMedia)(({ theme }) => ({
  height: "86vw",
  [theme.breakpoints.up("xs")]: {
    height: "100vw",
  },
  [theme.breakpoints.up("sm")]: {
    height: "35vw",
  },

  [theme.breakpoints.up("md")]: {
    height: "28vw",
  },
  [theme.breakpoints.up("lg")]: {
    height: "18vw",
  },
}));

const EventOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,

  padding: "2px 2px 5px 10px",
  color: "#F1F1F1",
});

const TransparentOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "70px",
  background: "rgba(0, 0, 0, 0.3)",
});

const EventCategory = styled(Typography)({
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  color: "#3ECF8E",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "bold",
  letterSpacing: 1,
});

const EventDate = styled(Box)({
  position: "absolute",
  top: 12,
  right: 12,
  backgroundColor: "#ffff",
  color: "black",
  padding: "2px 6px",
  borderRadius: "6px",
  textAlign: "center",
});

const EventTitle = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "6px",
  fontSize: "1.2rem",
  color: "#F1F1F1",
});

const EventLocation = styled(Typography)({
  display: "flex",
  alignItems: "center",
  fontSize: "0.8rem",
  lineHeight: "12px",
  // fontFamily: "Montserrat",
});

const ViewAllButton = styled(Box)({
  display: "flex",
  alignItems: "center",
  color: "#3ECF8E",
  cursor: "pointer",
});

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(8, 8, 8, 0.8)",
  boxShadow: "0 0 0 10px rgba(0,0,0,0.3)",
  "&:hover": {
    backgroundColor: "rgba(9, 9, 9, 1)",
  },
  zIndex: 1,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

// Données fictives (inchangées)
const popularEvents = [
  {
    id: 1,
    title: "Niska",
    date: { day: "15", month: "Nov" },
    location: "Brazzaville, Palais des congrès",
    category: "Concert",
    image:
      "https://yt3.googleusercontent.com/SdOo0xi3mAhYtgLsLt-2NMog4icQkWmmAc0LWtEKXSmpOYa59vcP8ll7ASI0s5MInaiNGK1H3g=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    id: 2,
    title: "Aya Nakamura",
    date: { day: "22", month: "Nov" },
    location: "Paris, Accor Arena",
    category: "Concert",
    image:
      "https://dynamicmedia.livenationinternational.com/h/c/n/def71c89-2424-4e1a-998a-740dafa3d249.jpg?auto=webp&width=1507.2",
  },

  {
    id: 3,
    title: "Damso",
    date: { day: "29", month: "Nov" },
    location: "Bruxelles, Forest National",
    category: "Concert",
    image:
      "https://akumradio.fm/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-28-at-09.01.14-560x600.jpeg'",
  },
  {
    id: 4,
    title: "Burna Boy",
    date: { day: "05", month: "Dec" },
    location: "Londres, O2 Arena",
    category: "Concert",
    image:
      "https://la-sirene.fr/wp-content/uploads/programmation/2464-carre-333.jpg",
  },
  {
    id: 5,
    title: "Burna Boy",
    date: { day: "05", month: "Dec" },
    location: "Londres, O2 Arena",
    category: "Concert",
    image: "https://www.adiac-congo.com/sites/default/files/tm_0.jpg",
  },
  // Ajoutez d'autres événements ici...
];

const PopularEvents = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const scrollRight = scrollWidth - clientWidth - scrollLeft;

      setShowLeftButton(scrollLeft > 20); // Ajoutez une petite marge
      setShowRightButton(scrollRight > 20); // Ajoutez une petite marge

      // Mise à jour de la direction du masque
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollAmount =
        direction === "left"
          ? -container.offsetWidth / 2
          : container.offsetWidth / 2;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters={isMobile}
      sx={{
        maxWidth: {
          xs: "100%",
          sm: "98%",
          md: "94%",
          lg: "94%",
        },
        mx: "auto",
      }}
    >
      <Box
        paddingTop="10px"
        position="relative"
        sx={{
          backgroundColor: " #131313",
          overflowX: "hidden",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          px={isMobile ? 2 : 0}
        >
          <Box display="flex" alignItems="center">
            <StarIcon
              style={{
                color: "#3ECF8E",
                marginRight: "5px",
              }}
            />
            <Typography
              variant="h5"
              fontSize="20px"
              fontWeight="bold"
              color="#F1F1F1"
              fontFamily="Roboto"
            >
              Populaires
            </Typography>
          </Box>
          <ViewAllButton>
            <Typography variant="body2">Tout afficher</Typography>
            <ArrowForwardIosIcon
              style={{
                marginLeft: "7px",
                color: "#F1F1F1",
                fontSize: "16px",
              }}
            />
          </ViewAllButton>
        </Box>
        {showLeftButton && !isMobile && (
          <ScrollButton
            onClick={() => scroll("left")}
            style={{ left: "10px", color: "#F1F1F1" }}
          >
            <ArrowBackIosNewIcon />
          </ScrollButton>
        )}
        {showRightButton && !isMobile && (
          <ScrollButton
            onClick={() => scroll("right")}
            style={{ right: "10px", color: "#F1F1F1" }}
          >
            <ArrowForwardIosIcon />
          </ScrollButton>
        )}
        <OuterContainer>
          <EventsContainer
            ref={containerRef}
            sx={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollSnapType: "x mandatory",
            }}
          >
            {" "}
            {popularEvents.map((event, index) => (
              <EventCard
                key={event.id}
                sx={{
                  mr: 2,
                  ml: index === 0 ? 2 : 0,
                  scrollSnapAlign: "center", // Changez "start" en "center"
                }}
              >
                {" "}
                <EventImage image={event.image} title={event.title} />
                <TransparentOverlay />
                <EventCategory variant="subtitle2">
                  {event.category}
                </EventCategory>
                <EventDate>
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      color: "#3ECF8E",
                    }}
                  >
                    {event.date.day}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ fontWeight: "bold", fontSize: "12px" }}
                  >
                    {event.date.month}
                  </Typography>
                </EventDate>
                <EventOverlay>
                  <EventTitle variant="h6">{event.title}</EventTitle>
                  <EventLocation variant="body2">
                    <LocationOnIcon
                      style={{
                        marginRight: "5px",
                        fontSize: "18px",
                        color: "#F1F1F1",
                      }}
                    />
                    {event.location}
                  </EventLocation>
                </EventOverlay>
              </EventCard>
            ))}
          </EventsContainer>
        </OuterContainer>
      </Box>
    </Container>
  );
};

export default PopularEvents;
