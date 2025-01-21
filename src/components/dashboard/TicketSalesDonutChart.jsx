import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const formatPercentage = (value, total) => {
  if (total === 0 || !value) return '0.0';
  return ((value / total) * 100).toFixed(1);
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(22, 22, 22, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          p: 1.5,
        }}
      >
        <Typography
          sx={{
            color: entry.payload.color,
            fontSize: '0.875rem',
            fontWeight: 500,
            mb: 0.5,
          }}
        >
          {entry.name}
        </Typography>
        <Typography sx={{ color: 'white', fontSize: '0.75rem' }}>
          {`${entry.value} billets (${formatPercentage(entry.value, entry.payload.total)}%)`}
        </Typography>
      </Box>
    );
  }
  return null;
};

const TicketSalesDonutChart = ({ datas }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const COLORS = {
    Standard: '#4A90FF',
    VIP: '#50E3C2',
    VVIP: '#FFCF5C',
    'Carré Or': '#FF7A7A',
  };

  const total = datas.reduce((sum, entry) => sum + entry.value, 0);
  const enhancedData = datas.map((entry) => ({
    ...entry,
    color: COLORS[entry.name],
    total: total,
  }));

  // Afficher un message spécial si aucun billet n'est vendu
  const renderContent = () => {
    if (total === 0) {
      return (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              textAlign: 'center',
            }}
          >
            Aucun billet vendu pour le moment
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Box
          sx={{
            width: '100%',
            height: { xs: '50%', sm: '60%' },
            maxHeight: 300,
            position: 'relative',
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enhancedData}
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? '85%' : '90%'}
                innerRadius={isMobile ? '65%' : '70%'}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {enhancedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                fontWeight: 600,
              }}
            >
              {total}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
              }}
            >
              Total billets
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 1, sm: 2 },
            mt: { xs: 2, sm: 3 },
          }}
        >
          {enhancedData.map((entry, index) => (
            <Box
              key={`legend-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                p: { xs: 0.5, sm: 1 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 8, sm: 10 },
                  height: { xs: 8, sm: 10 },
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                  mr: 1,
                }}
              />
              <Typography
                sx={{
                  color: 'white',
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                }}
              >
                {`${entry.name}: ${formatPercentage(entry.value, total)}%`}
              </Typography>
            </Box>
          ))}
        </Box>
      </>
    );
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        minHeight: { xs: 350, sm: 400, md: 450 },
        borderRadius: { xs: 2, sm: 3 },
        backgroundColor: '#131313',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            fontWeight: 600,
          }}
        >
          Répartition des ventes
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {renderContent()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketSalesDonutChart;
