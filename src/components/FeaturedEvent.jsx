import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const FeaturedEvent = () => {
  const featuredEvent = {
    title: "Annual City Marathon",
    date: "September 15, 2023",
    image: "https://source.unsplash.com/random/1200x400/?marathon",
    description:
      "Join us for the biggest running event of the year! Whether you're a seasoned runner or a beginner, there's a category for everyone.",
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Featured Event
      </Typography>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={featuredEvent.image}
          alt={featuredEvent.title}
        />
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {featuredEvent.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {featuredEvent.date}
          </Typography>
          <Typography variant="body1" paragraph>
            {featuredEvent.description}
          </Typography>
          <Button variant="contained" color="primary">
            Learn More
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FeaturedEvent;
