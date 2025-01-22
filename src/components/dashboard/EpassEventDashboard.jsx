import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Grid, styled } from '@mui/material';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import Header from './Header';
import MetricCard from './MetricCard';
import EventCard from './EventCard';
import TicketSalesChart from './TicketSalesChart';
import TicketSalesDonutChart from './TicketSalesDonutChart';
import theme from '../../theme/theme';
import ScannersPerformanceTable from './ScannersPerformanceTable';
import { useEventDashboard } from '../../features/events/api/queries';
import {
  DashboardLoading,
  DashboardError,
  DashboardNoData,
} from './DashboardStates';
import {
  AttachMoneyOutlined,
  ConfirmationNumberOutlined,
  QrCodeScannerOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';

const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const formatCurrency = (amount) => `${amount.toLocaleString()} XAF`;

const formatPercentage = (value, total) => {
  if (total === 0 || !value) return '0.0';
  return ((value / total) * 100).toFixed(1);
};

const calculateSalesPercentage = (sold, total) => {
  if (total === 0) return '0.0';
  return ((sold / total) * 100).toFixed(1);
};

const EpassEventDashboard = () => {
  const { id } = useParams();
  const { data: dashboardData, isLoading, error } = useEventDashboard(id);

  const { eventData, metricsData, ticketSalesData, ticketSalesDonutData } =
    useMemo(() => {
      if (!dashboardData) return {};

      const { event, generalStats, ticketCategories, saleByPeriod } =
        dashboardData;

      // Event Card Data
      const eventInfo = {
        imageUrl: event.coverImage,
        eventName: event.name,
        date: `${new Date(event.startDate).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
        location: `${event.location.city} - ${event.location.name}`,
        likes: generalStats.totalLikes,
        popularity: generalStats.likesPercentage.toFixed(0),
      };

      // Calculate total sold tickets for percentage calculations
      const totalSoldTickets = ticketCategories.reduce(
        (acc, category) =>
          acc + (category.initQuantity - category.availableQuantity),
        0
      );

      // Metrics Cards Data
      const metrics = [
        {
          title: 'Revenus totaux',
          value: formatCurrency(generalStats.totalRevenue),
          change: `${generalStats.objectivePercentage.toFixed(1)}% de l'objectif`,
          Icon: AttachMoneyOutlined,
          color: 'green',
          positive: true,
        },
        {
          title: 'Tickets vendus',
          value: `${generalStats.totalTicketsSold} / ${generalStats.totalTicket}`,
          change: `${formatPercentage(generalStats.totalTicketsSold, generalStats.totalTicket)}% de l'objectif`,
          Icon: ConfirmationNumberOutlined,
          color: 'blue',
          positive: true,
        },
        {
          title: 'Tickets scannés',
          value: generalStats.scannedCount.toString(),
          change: `${formatPercentage(generalStats.scannedCount, generalStats.totalTicketsSold)}% des tickets vendus`,
          Icon: QrCodeScannerOutlined,
          color: 'yellow',
          positive: true,
        },
        {
          title: 'Alertes fraude',
          value: generalStats.fraudCount.toString(),
          change: `${formatPercentage(generalStats.fraudCount, generalStats.scannedCount)}% des tickets scannés`,
          Icon: WarningAmberOutlined,
          color: 'red',
          positive: false,
        },
      ];

      // Ticket Sales Chart Data
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
        });
      });

      const salesData = dates.map((date, index) => ({
        date,
        ...Object.keys(saleByPeriod.lastSevenDays).reduce(
          (acc, category) => ({
            ...acc,
            // Inverser l'index pour aligner correctement les dates
            [category]: saleByPeriod.lastSevenDays[category][6 - index],
          }),
          {}
        ),
      }));

      // Donut Chart Data
      const donutData = ticketCategories.map((category) => {
        const soldTickets = category.initQuantity - category.availableQuantity;
        return {
          name: category.name,
          value: soldTickets,
          percentage:
            totalSoldTickets > 0
              ? ((soldTickets / totalSoldTickets) * 100).toFixed(1)
              : '0.0',
        };
      });

      return {
        eventData: eventInfo,
        metricsData: metrics,
        ticketSalesData: salesData,
        ticketSalesDonutData: donutData,
      };
    }, [dashboardData]);

  // Keeping the original scanners data
  const scannersData = [
    {
      id: 1,
      name: 'Alice Durand',
      email: 'alice@example.com',
      avatar: '/api/placeholder/40/40',
      validTickets: 230,
      fraudulentTickets: 3,
      progressPercentage: 85,
      isBlocked: false,
    },
    {
      id: 2,
      name: 'Bob Martin',
      email: 'bob@example.com',
      avatar: '/api/placeholder/40/40',
      validTickets: 180,
      fraudulentTickets: 7,
      progressPercentage: 70,
      isBlocked: false,
    },
    {
      id: 3,
      name: 'Claire Lefebvre',
      email: 'claire@example.com',
      avatar: '/api/placeholder/40/40',
      validTickets: 310,
      fraudulentTickets: 1,
      progressPercentage: 95,
      isBlocked: false,
    },
    {
      id: 4,
      name: 'David Moreau',
      email: 'david@example.com',
      avatar: '/api/placeholder/40/40',
      validTickets: 150,
      fraudulentTickets: 5,
      progressPercentage: 60,
      isBlocked: true,
    },
    {
      id: 5,
      name: 'Émilie Dubois',
      email: 'emilie@example.com',
      avatar: '/api/placeholder/40/40',
      validTickets: 280,
      fraudulentTickets: 2,
      progressPercentage: 90,
      isBlocked: false,
    },
  ];

  if (isLoading) return <DashboardLoading />;
  if (error) return <DashboardError />;
  if (!dashboardData) return <DashboardNoData />;

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <DashboardContainer>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <EventCard {...eventData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {metricsData.map((metric, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <MetricCard {...metric} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={8}>
            <TicketSalesChart data={ticketSalesData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TicketSalesDonutChart datas={ticketSalesDonutData} />
          </Grid>
          <Grid item xs={12}>
            <ScannersPerformanceTable scannersData={scannersData} />
          </Grid>
        </Grid>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default EpassEventDashboard;
