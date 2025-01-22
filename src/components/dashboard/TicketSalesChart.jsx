import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import EmptyTicketSales from './EmptyTicketSales';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(22, 22, 22, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          p: 1.5,
        }}
      >
        <Typography sx={{ color: 'white', fontSize: '0.875rem', mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            sx={{
              color: entry.color,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 0.5,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: entry.color,
                display: 'inline-block',
              }}
            />
            {`${entry.name}: ${entry.value} billet${entry.value > 1 ? 's' : ''}`}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const TicketSalesChart = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const chartColors = {
    Standard: {
      stroke: '#4A90FF',
      fill: 'rgba(74, 144, 255, 0.15)',
    },
    VIP: {
      stroke: '#50E3C2',
      fill: 'rgba(80, 227, 194, 0.15)',
    },
    VVIP: {
      stroke: '#FFCF5C',
      fill: 'rgba(255, 207, 92, 0.15)',
    },
    'Carré Or': {
      stroke: '#FF7A7A',
      fill: 'rgba(255, 122, 122, 0.15)',
    },
  };

  // Déterminer les catégories présentes dans les données
  const availableCategories = useMemo(() => {
    if (!data || data.length === 0) return [];
    const firstDataPoint = data[0];
    return Object.keys(firstDataPoint).filter((key) => key !== 'date');
  }, [data]);

  // Vérifier s'il y a des données à afficher
  const hasData = useMemo(() => {
    if (!data || data.length === 0) return false;
    return availableCategories.some((category) =>
      data.some((point) => point[category] > 0)
    );
  }, [data, availableCategories]);

  // Calculer le maximum pour l'axe Y
  const yAxisMax = useMemo(() => {
    if (!data || data.length === 0) return 10;
    return Math.max(
      ...data.map((point) =>
        availableCategories.reduce(
          (sum, category) => sum + (point[category] || 0),
          0
        )
      )
    );
  }, [data, availableCategories]);

  const renderContent = () => {
    if (!hasData) {
      return <EmptyTicketSales />;
    }

    return (
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: isMobile ? -20 : 0,
            bottom: 0,
          }}
        >
          <defs>
            {availableCategories.map((category) => (
              <linearGradient
                key={category}
                id={`gradient${category}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartColors[category]?.stroke}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={chartColors[category]?.stroke}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="date"
            stroke="rgba(255, 255, 255, 0.5)"
            fontSize={isMobile ? 10 : 12}
            tickMargin={10}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.5)"
            fontSize={isMobile ? 10 : 12}
            tickMargin={10}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tickFormatter={(value) => `${value}`}
            domain={[0, yAxisMax > 0 ? 'auto' : 10]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Legend
            height={36}
            iconSize={isMobile ? 8 : 10}
            iconType="circle"
            wrapperStyle={{
              fontSize: isMobile ? '0.7rem' : '0.8rem',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          />
          {availableCategories.map((category) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              name={category}
              stackId="1"
              stroke={chartColors[category]?.stroke}
              fill={`url(#gradient${category})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: { xs: 350, sm: 400, md: 450 },
        borderRadius: { xs: 2, sm: 3 },
        backgroundColor: '#131313',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            fontWeight: 600,
          }}
        >
          Ventes journalières des billets par catégorie
        </Typography>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default TicketSalesChart;
