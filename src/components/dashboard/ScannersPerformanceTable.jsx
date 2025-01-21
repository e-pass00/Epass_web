import React, { useState } from 'react';
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import { Block, CheckCircle, Warning } from '@mui/icons-material';
import styled from 'styled-components';

const ResponsiveContainer = styled(Box)`
  background-color: rgba(139, 139, 139, 0.1);

  border-radius: 13px;

  padding: 22px;
  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const ResponsiveTableContainer = styled(TableContainer)`
  background-color: transparent;
  border-radius: 8px;

  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileCards = styled(Box)`
  display: none;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const CardContainer = styled(Box)`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  transition: opacity 0.3s ease;
`;

const StyledTableCell = styled(TableCell)`
  color: white !important;
  font-weight: bold !important;
`;

const StyledChip = styled(Chip)`
  background-color: ${(props) => props.bgcolor} !important;
  color: ${(props) => props.textcolor} !important;
`;

const ScannersPerformanceTable = ({ scannersData }) => {
  const [scanners, setScanners] = useState(scannersData);

  const toggleBlockScanner = (id) => {
    setScanners(
      scanners.map((scanner) =>
        scanner.id === id
          ? { ...scanner, isBlocked: !scanner.isBlocked }
          : scanner
      )
    );
  };

  return (
    <ResponsiveContainer>
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          mb: { xs: 2, sm: 3, md: 4 },
          fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
          fontWeight: 600,
        }}
      >
        Performance des Scanners
      </Typography>

      {/* Desktop/Tablet View */}
      <ResponsiveTableContainer>
        <Table aria-label="scanner performance table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Scanner</StyledTableCell>
              <StyledTableCell align="center">Tickets Valides</StyledTableCell>
              <StyledTableCell align="center">Tickets Fraudés</StyledTableCell>
              <StyledTableCell align="center">Statut</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scanners.map((scanner) => (
              <TableRow
                key={scanner.id}
                sx={{
                  opacity: scanner.isBlocked ? 0.6 : 1,
                  transition: 'opacity 0.3s ease',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <Avatar src={scanner.avatar} alt={scanner.name} />
                    <Box ml={2}>
                      <Typography variant="subtitle2" sx={{ color: 'white' }}>
                        {scanner.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        {scanner.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <StyledChip
                    icon={<CheckCircle sx={{ color: '#3ECF8E !important' }} />}
                    label={scanner.validTickets}
                    bgcolor="rgba(76, 175, 80, 0.1)"
                    textcolor="#3ECF8E"
                  />
                </TableCell>
                <TableCell align="center">
                  <StyledChip
                    icon={<Warning sx={{ color: '#F44336 !important' }} />}
                    label={scanner.fraudulentTickets}
                    bgcolor="rgba(244, 67, 54, 0.1)"
                    textcolor="#F44336"
                  />
                </TableCell>
                <TableCell align="center">
                  <StyledChip
                    label={scanner.isBlocked ? 'Bloqué' : 'Actif'}
                    bgcolor={
                      scanner.isBlocked
                        ? 'rgba(244, 67, 54, 0.1)'
                        : 'rgba(76, 175, 80, 0.1)'
                    }
                    textcolor={scanner.isBlocked ? '#F44336' : '#3ECF8E'}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={scanner.isBlocked ? 'success' : 'error'}
                    startIcon={scanner.isBlocked ? <CheckCircle /> : <Block />}
                    onClick={() => toggleBlockScanner(scanner.id)}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: scanner.isBlocked
                        ? '#3ECF8E'
                        : '#F44336',
                    }}
                  >
                    {scanner.isBlocked ? 'Débloquer' : 'Bloquer'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ResponsiveTableContainer>

      {/* Mobile View */}
      <MobileCards>
        {scanners.map((scanner) => (
          <CardContainer
            key={scanner.id}
            sx={{ opacity: scanner.isBlocked ? 0.6 : 1 }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src={scanner.avatar} alt={scanner.name} />
              <Box ml={2}>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>
                  {scanner.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  {scanner.email}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <StyledChip
                icon={<CheckCircle sx={{ color: '#3ECF8E !important' }} />}
                label={`Valides: ${scanner.validTickets}`}
                bgcolor="rgba(76, 175, 80, 0.1)"
                textcolor="#3ECF8E"
                size="small"
              />
              <StyledChip
                icon={<Warning sx={{ color: '#F44336 !important' }} />}
                label={`Fraudés: ${scanner.fraudulentTickets}`}
                bgcolor="rgba(244, 67, 54, 0.1)"
                textcolor="#F44336"
                size="small"
              />
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <StyledChip
                label={scanner.isBlocked ? 'Bloqué' : 'Actif'}
                bgcolor={
                  scanner.isBlocked
                    ? 'rgba(244, 67, 54, 0.1)'
                    : 'rgba(76, 175, 80, 0.1)'
                }
                textcolor={scanner.isBlocked ? '#F44336' : '#3ECF8E'}
                size="small"
              />
              <Button
                variant="contained"
                color={scanner.isBlocked ? 'success' : 'error'}
                startIcon={scanner.isBlocked ? <CheckCircle /> : <Block />}
                onClick={() => toggleBlockScanner(scanner.id)}
                size="small"
                sx={{
                  textTransform: 'none',
                  backgroundColor: scanner.isBlocked ? '#3ECF8E' : '#F44336',
                }}
              >
                {scanner.isBlocked ? 'Débloquer' : 'Bloquer'}
              </Button>
            </Box>
          </CardContainer>
        ))}
      </MobileCards>
    </ResponsiveContainer>
  );
};

export default ScannersPerformanceTable;
