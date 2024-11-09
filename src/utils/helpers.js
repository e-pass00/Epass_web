import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const handleDownloadTicket = async (tickets) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Palette de couleurs futuriste
    const colors = {
      neon: '#00FFD1', // Cyan néon
      plasma: '#FF10F0', // Rose plasma
      hologram: '#7B61FF', // Violet holographique
      darkMatter: '#0A0B3B', // Bleu profond
      energy: '#14F195', // Vert énergie
      cosmic: '#141E30', // Bleu cosmique
      stellar: '#FFFFFF', // Blanc stellaire
      // Couleurs avec transparence
      neonLight: '#80FFE5', // Version plus claire du néon
      plasmaLight: '#FF80F7', // Version plus claire du plasma
      // Nouvelles couleurs pour les catégories spéciales
      carreOr: ['#FFD700', '#FFA500'], // Or et Orange
      vip: ['#fa23f0', '#4A0E4E'], // Tons violets
    };

    // Fonction pour créer des effets de lignes holographiques
    const createHolographicEffect = () => {
      // Lignes holographiques avec espacement
      for (let i = 0; i < 297; i += 16) {
        doc.setDrawColor(colors.hologram);
        doc.setLineWidth(0.1);
        doc.line(0, i, 210, i - 30);
      }
    };

    // Fonction pour créer des circuits imprimés décoratifs
    const drawCircuitPattern = () => {
      doc.setDrawColor(colors.neonLight);
      doc.setLineWidth(0.2);

      const patterns = [
        [
          [10, 10],
          [30, 10],
          [30, 30],
          [50, 30],
        ],
        [
          [160, 10],
          [180, 10],
          [180, 30],
          [200, 30],
        ],
        [
          [10, 267],
          [30, 267],
          [30, 287],
          [50, 287],
        ],
        [
          [160, 267],
          [180, 267],
          [180, 287],
          [200, 287],
        ],
      ];

      patterns.forEach((pattern) => {
        for (let i = 0; i < pattern.length - 1; i++) {
          doc.line(
            pattern[i][0],
            pattern[i][1],
            pattern[i + 1][0],
            pattern[i + 1][1]
          );
        }
        pattern.forEach((point) => {
          doc.circle(point[0], point[1], 0.5, 'F');
        });
      });
    };

    // Fonction pour créer un hexagone
    const drawHexagon = (x, y, size) => {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        points.push([x + size * Math.cos(angle), y + size * Math.sin(angle)]);
      }

      doc.setLineWidth(0.3);
      points.forEach((point, i) => {
        const nextPoint = points[(i + 1) % 6];
        doc.line(point[0], point[1], nextPoint[0], nextPoint[1]);
      });
    };

    // Définition des couleurs selon la catégorie
    let categoryColors = [colors.neon, colors.plasma, colors.energy];
    if (tickets.categoryBillet === 'Carré Or') {
      categoryColors = [
        colors.carreOr[0],
        colors.carreOr[1],
        colors.carreOr[0],
      ];
    } else if (['VIP', 'VVIP'].includes(tickets.categoryBillet)) {
      categoryColors = [colors.vip[0], colors.vip[1], colors.vip[0]];
    }

    // Fond principal futuriste
    doc.setFillColor(...hexToRGB(colors.darkMatter));
    doc.rect(0, 0, 210, 297, 'F');

    // Effets visuels de base
    createHolographicEffect();
    drawCircuitPattern();

    // Cadre principal futuriste
    doc.setFillColor(...hexToRGB(colors.cosmic));
    doc.rect(15, 20, 180, 60, 'F');

    // Bordures néon multiples avec les couleurs selon la catégorie
    categoryColors.forEach((color, i) => {
      doc.setDrawColor(...hexToRGB(color));
      doc.setLineWidth(0.3);
      doc.rect(15 - i * 0.8, 20 - i * 0.8, 180 + i * 1.6, 60 + i * 1.6);
    });

    // Titre principal
    doc.setTextColor(...hexToRGB(colors.stellar));
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text('E-PASS', 105, 45, { align: 'center' });

    // Effet de "glow" pour le titre
    doc.setTextColor(...hexToRGB(categoryColors[0]));
    doc.setFontSize(32.2);
    doc.text('E-PASS', 105, 45, { align: 'center' });

    // Sous-titre
    doc.setFontSize(12);
    doc.setTextColor(...hexToRGB(colors.stellar));
    doc.text("Ce ticket vous donne accès à l'événement", 105, 60, {
      align: 'center',
    });

    // QR Code avec design futuriste
    const qrCanvas = document.createElement('canvas');
    const qrSize = 180;
    qrCanvas.width = qrSize;
    qrCanvas.height = qrSize;

    await new Promise((resolve, reject) => {
      QRCode.toCanvas(
        qrCanvas,
        tickets.billetId,
        {
          width: qrSize,
          height: qrSize,
          margin: 2,
          color: {
            dark: categoryColors[0],
            light: colors.darkMatter,
          },
        },
        (error) => {
          if (error) reject(error);
          resolve();
        }
      );
    });

    // Cadre QR avec hexagones multiples
    const qrPosX = 75;
    const qrPosY = 90;

    // Hexagones concentriques avec les couleurs de la catégorie
    categoryColors.forEach((color, i) => {
      doc.setDrawColor(...hexToRGB(color));
      drawHexagon(qrPosX + 30, qrPosY + 30, 40 + i * 3);
    });

    // QR code central
    const qrImageData = qrCanvas.toDataURL('image/png');
    doc.addImage(qrImageData, 'PNG', qrPosX, qrPosY, 60, 60);

    // Configuration des sections d'information
    const infoStartY = 170;
    const infoWidth = 75;
    const infoHeight = 45;

    // Fonction pour ajouter une section d'information futuriste
    const addFuturisticSection = (label, value, x, y) => {
      doc.setFillColor(...hexToRGB(colors.cosmic));
      doc.roundedRect(x, y, infoWidth, infoHeight, 2, 2, 'F');

      categoryColors.slice(0, 2).forEach((color, i) => {
        doc.setDrawColor(...hexToRGB(color));
        doc.setLineWidth(0.2);
        doc.roundedRect(
          x - i * 0.5,
          y - i * 0.5,
          infoWidth + i,
          infoHeight + i,
          2,
          2
        );
      });

      doc.setDrawColor(...hexToRGB(categoryColors[0]));
      doc.setLineWidth(0.5);
      doc.line(x + 5, y + 12, x + infoWidth - 5, y + 12);

      doc.setTextColor(...hexToRGB(categoryColors[0]));
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(label.toUpperCase(), x + 5, y + 8);

      doc.setTextColor(...hexToRGB(colors.stellar));
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(value, infoWidth - 10);
      lines.forEach((line, index) => {
        doc.text(line, x + 5, y + 25 + index * 8);
      });
    };

    // Disposition des informations
    const leftX = 25;
    const rightX = 110;

    addFuturisticSection('Événement', tickets.eventName, leftX, infoStartY);
    addFuturisticSection(
      'Date & Heure',
      `${formatDate(tickets.startDate)}\n${formatTime(tickets.startDate)}`,
      rightX,
      infoStartY
    );
    addFuturisticSection('Lieu', tickets.locationName, leftX, infoStartY + 55);
    addFuturisticSection(
      'Catégorie',
      tickets.categoryBillet,
      rightX,
      infoStartY + 55
    );

    // Pied de page futuriste avec message de scan
    doc.setFillColor(...hexToRGB(colors.cosmic));
    doc.rect(0, 277, 210, 20, 'F');

    // Message de scan centré
    doc.setTextColor(...hexToRGB(colors.stellar));
    doc.setFontSize(10);
    doc.text(
      "Veuillez faire scanner votre QR code à l'entrée de l'événement",
      105,
      288,
      { align: 'center' }
    );

    // Fonction utilitaire pour convertir les couleurs hex en RGB
    function hexToRGB(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    }

    // Sauvegarde avec nom futuriste
    const timestamp = new Date().getTime().toString(16).toUpperCase();
    const fileName = `EPASS_${tickets.eventName.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};
