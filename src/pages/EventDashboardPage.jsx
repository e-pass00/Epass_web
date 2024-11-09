/* eslint-disable react/prop-types */
// Header.jsx

import { styled, Box, Typography, IconButton, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const LogoImage = styled("img")({
  width: "40px", // Adjust size as needed
  height: "40px", // Adjust size as needed
  filter:
    "brightness(0) saturate(100%) invert(80%) sepia(29%) saturate(1115%) hue-rotate(101deg) brightness(99%) contrast(87%)",
});

const AppName = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "22px",
  color: theme.palette.text.primary,
  background: "linear-gradient(45deg, #F1F1F1 30%, #3ECF8E 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const IconsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "5px",
}));

const Header = () => (
  <HeaderContainer>
    <LogoContainer>
      <LogoImage
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADHklEQVR4nO1bTW4TMRR+7QYo52gvQ4ELJDlDf0AIJPS96Qqp6qIrFFDZoHKJbHsLCkeg3CDIMxNiZzKO59nOTFx/kjdJZuz3zXvO5/lsolVcXj6nonhNwBkxv7O0twQcUd9QY1BjsY/1lIBXBBzYbrVXB/WXmOdODbinvsH8y3m8zA/EfF7GagDYJ+BHhxvtKgGLdmuSwGUKmYExTwn41NqYP9LFxSH1DTUGNRb7WKd1THqMZ8uaN9P+K11fP6HUoGJivjHKAWpOUJPD8sOfSQZvkrAsGeBYEfBGI+AzpQ5VDkYZAKx9wJQ6GvEiE8A5A9ihBJRWYB5vUFx6G5fXuKXl4t7Na0L3Ky4BYCIQHGNHAiat14Tu14MAFihFt0nVNobQ/QYhALizKK+7aASE6HcNAR809t6LBin5nYwA/34b8QJHpU5Wzabt0yHALd5kCRADmQDOGcC5BOY1CTOLEptZ6rlN1c0cdYCs3+BzAAsFiYuqiy2ExODyyXUdyKhzMKvXhOg3CFC+OB1Z372ZbbRmYbNJ1a27xr/fwQCPbOndQCYAOQPItQTsltcwbLmoGbDJ8RmCK9UrAaptFWiouM1p2Exjd7XWZnn1SMCkcxranqL0b7A3AniNIvMjQKbWei0BaIrMxR1ud27las0k0u91/E4i5Ov4wcBmjEj+HaIshmLCZox03xAx4MVQG7JERl4j0OCXyYjqDtt8gXj9dkJcd9hGQLx+OyEVd1gMJOIOByKAvX/3KL1BeBojCRAw6Vy/iRHAnXV8dAJQbhj4XS4yYm+QkBkjMTZIaPFii1tkQk+QgbbIcOcO5O6wHwEh3OHGGLDFbXL+BPgLITEBHMCl1e/h+tIitDvskQH7AdzhxT3cX1qEdofFBKSCTAByBpCR8czn2gQypdQBfNHiPSUqipcaI/dJH5oCntYqsIq3KF6oDw/qE5ULVm6SJKEK/pv2sP/Q1dWz6kuzDOa1+TBN5uywSnv9yVcEnKyeG74VCI5dPTr7vXl+mGivPjH+kCwBKu2rJ98Inv5DzQnVxKiOnKdydljFcrys+SX+AXTCbU7GY3MmAAAAAElFTkSuQmCC"
        alt="Logo"
      />
      <AppName>E-pass Dashboard</AppName>
    </LogoContainer>
    <IconsContainer>
      <IconButton>
        <EditIcon sx={{ fontSize: "22px" }} />
      </IconButton>
      <IconButton>
        <SettingsIcon sx={{ fontSize: "22px" }} />
      </IconButton>
      <IconButton>
        <NotificationsIcon sx={{ fontSize: "22px" }} />
      </IconButton>
      <Avatar src="/path-to-avatar.jpg" sx={{ fontSize: "22px" }} />
    </IconsContainer>
  </HeaderContainer>
);

// MetricCard.jsx

import { Paper } from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 6px 30px 0 rgba(0, 0, 0, 0.1)",
  },
}));

const IconWrapper = styled(Box)(({ bgColor }) => ({
  backgroundColor: bgColor,
  borderRadius: "50%",
  padding: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "16px",
}));

const MetricHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
});

const MetricTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  textTransform: "uppercase",
  // letterSpacing: "1px",,
  fontFamily: "sans-serif",
  color: theme.palette.text.secondary,
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: "1.30rem",
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: "8px",
}));

const MetricChange = styled(Typography)(({ theme, positive }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: positive ? "#3ECF8E" : theme.palette.error.main,
  display: "flex",
  alignItems: "center",
}));

const colorPalette = {
  yellow: {
    light: "rgba(255, 193, 7, 0.2)",
    main: "rgb(255, 193, 7)",
  },
  blue: {
    light: "rgba(33, 150, 243, 0.2)",
    main: "rgb(33, 150, 243)",
  },
  green: {
    light: "rgba(76, 175, 80, 0.2)",
    main: "#3ECF8E",
  },
  red: {
    light: "rgba(244, 67, 54, 0.2)",
    main: "rgb(244, 67, 54)",
  },
};

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
  positive,
}) => {
  const bgColor = colorPalette[color].light;
  const iconColor = colorPalette[color].main;

  return (
    <StyledPaper elevation={0}>
      <MetricHeader>
        <IconWrapper bgColor={bgColor}>
          <Icon style={{ color: iconColor, fontSize: 24 }} />
        </IconWrapper>
        <MetricTitle variant="h6">{title}</MetricTitle>
      </MetricHeader>
      <MetricValue variant="h4">{value}</MetricValue>
      <MetricChange positive={positive}>
        {positive ? (
          <KeyboardArrowUpIcon
            fontSize="small"
            style={{ marginRight: "4px" }}
          />
        ) : (
          <KeyboardArrowDownIcon
            fontSize="small"
            style={{ marginRight: "4px" }}
          />
        )}
        {change}
      </MetricChange>
    </StyledPaper>
  );
};

// ChartCard.jsx

import { ResponsiveContainer } from "recharts";

//Event popular
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const EventCardWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 358,
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
  "&:hover": {
    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  },
}));

const EventImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: theme.spacing(2),
}));

const PopularityContainer = styled(Box)(({ theme, popularity }) => ({
  position: "absolute",
  top: 20,
  right: 20,
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderRadius: "50%",
    border: `3px solid ${theme.palette.error.main}`,
    borderTopColor: "transparent",
    transform: `rotate(${popularity * 3.6}deg)`,
  },
}));

const HeartPopularity = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    width: "100%",
    height: "100%",
    color: theme.palette.error.main,
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: "white",
  marginBottom: theme.spacing(1),
  "& svg": {
    marginRight: theme.spacing(1),
  },
}));

const LikesCounter = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 20,
  left: 20,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  display: "flex",
  alignItems: "center",
  "& svg": {
    marginRight: theme.spacing(0.5),
  },
}));

const EventCard = ({
  imageUrl,
  eventName,
  date,
  location,
  likes,
  popularity,
}) => {
  return (
    <EventCardWrapper>
      <EventImage src={imageUrl} alt={eventName} />
      <Overlay>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ color: "white", fontWeight: "bold" }}
        >
          {eventName}
        </Typography>
        <InfoBox>
          <CalendarTodayIcon fontSize="small" />
          <Typography variant="body2">{date}</Typography>
        </InfoBox>
        <InfoBox>
          <LocationOnIcon fontSize="small" />
          <Typography variant="body2">{location}</Typography>
        </InfoBox>
      </Overlay>
      <PopularityContainer popularity={popularity}>
        <HeartPopularity>
          <FavoriteIcon />
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              color: "white",
              fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            {popularity}%
          </Typography>
        </HeartPopularity>
      </PopularityContainer>
      <LikesCounter>
        <ThumbUpAltIcon fontSize="small" />
        <Typography variant="body2" fontWeight="bold">
          {likes}
        </Typography>
      </LikesCounter>
    </EventCardWrapper>
  );
};

//Event graph

import { Card, CardContent } from "@mui/material";

// Données factices pour l'exemple

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { date: "01/09", Standard: 120, VIP: 60, VVIP: 30, "Carré Or": 15 },
  { date: "02/09", Standard: 150, VIP: 70, VVIP: 35, "Carré Or": 20 },
  { date: "03/09", Standard: 100, VIP: 50, VVIP: 25, "Carré Or": 10 },
  { date: "04/09", Standard: 180, VIP: 90, VVIP: 45, "Carré Or": 25 },
  { date: "05/09", Standard: 130, VIP: 65, VVIP: 32, "Carré Or": 18 },
  { date: "06/09", Standard: 200, VIP: 100, VVIP: 50, "Carré Or": 30 },
  { date: "07/09", Standard: 170, VIP: 85, VVIP: 42, "Carré Or": 22 },
];

const TicketSalesChart = () => {
  return (
    <Card
      sx={{
        width: "100%",
        height: 400,
        borderRadius: 2,
        backgroundColor: "#131313",
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ color: "white", mb: 4 }}>
          Ventes journalières des billets par catégorie
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="Standard"
              stackId="1"
              stroke="#0088FE"
              fill="#0088FE"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="VIP"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="VVIP"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="Carré Or"
              stackId="1"
              stroke="#ff7300"
              fill="#ff7300"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

//segment de ventes

import { PieChart, Pie, Cell } from "recharts";

const datas = [
  { name: "Standard", value: 1050 },
  { name: "VIP", value: 520 },
  { name: "VVIP", value: 259 },
  { name: "Carré Or", value: 140 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TicketSalesDonutChart = () => {
  const total = datas.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 400,
        borderRadius: 2,
        backgroundColor: "#131313",
      }}
    >
      <CardContent
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h5" sx={{ color: "white", mb: 4 }}>
          Répartition des ventes
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", height: "60%", maxHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datas}
                  cx="50%"
                  cy="50%"
                  outerRadius="90%"
                  innerRadius="70%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {datas.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value} billets`,
                    "Nombre de billets vendus",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              mt: 2,
            }}
          >
            {datas.map((entry, index) => (
              <Box
                key={`legend-${index}`}
                sx={{ display: "flex", alignItems: "center", m: 1 }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: COLORS[index % COLORS.length],
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  {entry.name}: {((entry.value / total) * 100).toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// TransactionsTable.jsx

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Button,
  Chip,
} from "@mui/material";
import { Block, CheckCircle, Warning } from "@mui/icons-material";

const initialScannersData = [
  {
    id: 1,
    name: "Alice Durand",
    email: "alice@example.com",
    avatar: "/api/placeholder/40/40",
    validTickets: 230,
    fraudulentTickets: 3,
    progressPercentage: 85,
    isBlocked: false,
  },
  {
    id: 2,
    name: "Bob Martin",
    email: "bob@example.com",
    avatar: "/api/placeholder/40/40",
    validTickets: 180,
    fraudulentTickets: 7,
    progressPercentage: 70,
    isBlocked: false,
  },
  {
    id: 3,
    name: "Claire Lefebvre",
    email: "claire@example.com",
    avatar: "/api/placeholder/40/40",
    validTickets: 310,
    fraudulentTickets: 1,
    progressPercentage: 95,
    isBlocked: false,
  },
  {
    id: 4,
    name: "David Moreau",
    email: "david@example.com",
    avatar: "/api/placeholder/40/40",
    validTickets: 150,
    fraudulentTickets: 5,
    progressPercentage: 60,
    isBlocked: true,
  },
  {
    id: 5,
    name: "Émilie Dubois",
    email: "emilie@example.com",
    avatar: "/api/placeholder/40/40",
    validTickets: 280,
    fraudulentTickets: 2,
    progressPercentage: 90,
    isBlocked: false,
  },
];

const ScannersPerformanceTable = () => {
  const [scannersData, setScannersData] = useState(initialScannersData);

  const toggleBlockScanner = (id) => {
    setScannersData(
      scannersData.map((scanner) =>
        scanner.id === id
          ? { ...scanner, isBlocked: !scanner.isBlocked }
          : scanner
      )
    );
  };

  return (
    <Box sx={{ backgroundColor: "#121212" }}>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "transparent", p: 2, borderRadius: 2 }}
      >
        <Typography variant="h5" sx={{ color: "white", mb: 4 }}>
          Performance des Scanners
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="scanner performance table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Scanner
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Tickets Valides
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Tickets Fraudés
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Progression
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Statut
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scannersData.map((scanner) => (
              <TableRow
                key={scanner.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  opacity: scanner.isBlocked ? 0.6 : 1,
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <Avatar src={scanner.avatar} alt={scanner.name} />
                    <Box ml={2}>
                      <Typography variant="subtitle2" sx={{ color: "white" }}>
                        {scanner.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {scanner.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<CheckCircle sx={{ color: "#3ECF8E !important" }} />}
                    label={scanner.validTickets}
                    sx={{
                      backgroundColor: "rgba(76, 175, 80, 0.1)",
                      color: "#3ECF8E",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={<Warning sx={{ color: "#F44336 !important" }} />}
                    label={scanner.fraudulentTickets}
                    sx={{
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      color: "#F44336",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress
                        variant="determinate"
                        value={scanner.progressPercentage}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#2196f3",
                          },
                        }}
                      />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        {`${Math.round(scanner.progressPercentage)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={scanner.isBlocked ? "Bloqué" : "Actif"}
                    sx={{
                      backgroundColor: scanner.isBlocked
                        ? "rgba(244, 67, 54, 0.1)"
                        : "rgba(76, 175, 80, 0.1)",
                      color: scanner.isBlocked ? "#F44336" : "#3ECF8E",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={scanner.isBlocked ? "success" : "error"}
                    startIcon={scanner.isBlocked ? <CheckCircle /> : <Block />}
                    onClick={() => toggleBlockScanner(scanner.id)}
                    sx={{
                      textTransform: "none",

                      backgroundColor: scanner.isBlocked
                        ? "#3ECF8E"
                        : "#F44336",
                    }}
                  >
                    {scanner.isBlocked ? "Débloquer" : "Bloquer"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// EpassEventDashboard.jsx (Main Component)

import { ThemeProvider } from "@mui/material/styles";

import { Grid } from "@mui/material";

import theme from "../theme/theme";

import {
  AttachMoneyOutlined,
  ConfirmationNumberOutlined,
  QrCodeScannerOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

// Sample data (you should replace this with your actual data)

const EpassEventDashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <DashboardContainer>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <EventCard
              imageUrl="https://yt3.googleusercontent.com/SdOo0xi3mAhYtgLsLt-2NMog4icQkWmmAc0LWtEKXSmpOYa59vcP8ll7ASI0s5MInaiNGK1H3g=s900-c-k-c0x00ffffff-no-rj"
              eventName="Festival ElectroWave 2024"
              date="15-17 Août 2024"
              location="Paris, France"
              likes={12500}
              popularity={85}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Revenus totaux"
                  value="134 520 XAF"
                  change="+8.2% depuis le mois dernier"
                  icon={AttachMoneyOutlined}
                  color="green"
                  positive={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Tickets vendus"
                  value="1 254 / 1 500"
                  change="83.6% de l'objectif"
                  icon={ConfirmationNumberOutlined}
                  color="blue"
                  positive={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Tickets scannés"
                  value="978"
                  change="78% des tickets vendus"
                  icon={QrCodeScannerOutlined}
                  color="yellow"
                  positive={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard
                  title="Alertes fraude"
                  value="23"
                  change="2.3% des tickets scannés"
                  icon={WarningAmberOutlined}
                  color="red"
                  positive={false}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <TicketSalesChart />
          </Grid>

          <Grid item xs={12} md={4}>
            <TicketSalesDonutChart />
          </Grid>

          <Grid item xs={12}>
            <ScannersPerformanceTable />
          </Grid>
        </Grid>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default EpassEventDashboard;
