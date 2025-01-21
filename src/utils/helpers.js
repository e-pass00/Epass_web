import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const loadFirebaseImage = async (url) => {
  try {
    if (url.includes('storage.googleapis.com')) {
      const storage = getStorage();
      const decodedUrl = decodeURIComponent(url);
      const bucketMatch = decodedUrl.match(
        /storage\.googleapis\.com\/([^/]+)\/(.+)/
      );
      if (!bucketMatch) throw new Error('Invalid storage URL format');

      const [, bucket, path] = bucketMatch;
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);

      return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 1.0));
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.crossOrigin = 'anonymous';
        img.src = downloadURL;
      });
    }
    throw new Error('Unsupported URL format');
  } catch (error) {
    console.error('Error in loadFirebaseImage:', error);
    throw error;
  }
};

const loadFirebaseImageWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await loadFirebaseImage(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, i))
      );
    }
  }
};

export const handleDownloadTicket = async (tickets) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 140],
      compress: true,
    });

    const pageWidth = 80;
    const pageHeight = 140;
    const margin = 3;
    const contentWidth = pageWidth - margin * 2;

    // Fond noir
    doc.setFillColor(18, 18, 18);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Conteneur principal (transparent)
    const mainContainer = {
      x: margin,
      y: margin,
      width: contentWidth,
      height: pageHeight - margin * 2,
    };
    doc.setFillColor(42, 42, 42);
    doc.roundedRect(
      mainContainer.x,
      mainContainer.y,
      mainContainer.width,
      mainContainer.height,
      3,
      3,
      'F'
    );

    // Image de couverture avec coins arrondis
    const coverHeight = 60;
    if (tickets.coverImage) {
      try {
        const imageData = await loadFirebaseImageWithRetry(tickets.coverImage);
        // D'abord, créer un rectangle arrondi comme masque
        doc.setFillColor(42, 42, 42);
        doc.roundedRect(
          margin + 3,
          margin + 3,
          contentWidth - 6,
          coverHeight,
          2,
          2,
          'F'
        );
        // Puis ajouter l'image avec les mêmes dimensions
        doc.addImage(
          imageData,
          'JPEG',
          margin + 3,
          margin + 3,
          contentWidth - 6,
          coverHeight,
          undefined,
          'MEDIUM',
          0
        );
      } catch (error) {
        console.error('Failed to add cover image:', error);
      }
    }

    // Section blanche du ticket
    const ticketSection = {
      x: margin + 3,
      y: margin + coverHeight + 6,
      width: contentWidth - 6,
      height: pageHeight - coverHeight - margin * 5,
    };
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(
      ticketSection.x,
      ticketSection.y,
      ticketSection.width,
      ticketSection.height,
      2,
      2,
      'F'
    );

    // Titre de l'événement
    let currentY = ticketSection.y + 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(9);
    doc.text(tickets.eventName, pageWidth / 2, currentY, {
      align: 'center',
      maxWidth: contentWidth - 16,
    });

    // Ligne pointillée supérieure
    currentY += 4;
    doc.setLineDash([1, 1]);
    doc.setDrawColor(224, 224, 224);
    doc.line(
      ticketSection.x,
      currentY,
      ticketSection.x + ticketSection.width,
      currentY
    );

    // Grid d'informations
    const gridStartY = currentY + 5;
    const leftColX = ticketSection.x + 6;
    const rightColX = ticketSection.x + ticketSection.width - 6;

    const addInfoPair = (label, value, x, y, align = 'left') => {
      doc.setFontSize(7);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(label, x, y, { align });

      doc.setFontSize(7);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(48, 48, 48);
      doc.text(value, x, y + 3, { align });
    };

    // Informations
    addInfoPair(
      'Date',
      formatDateStyled(tickets.startDate),
      leftColX,
      gridStartY
    );
    addInfoPair(
      'Heure',
      formatTime(tickets.startDate),
      rightColX,
      gridStartY,
      'right'
    );
    addInfoPair('Lieu', tickets.locationName, leftColX, gridStartY + 10);
    addInfoPair(
      'Catégorie',
      tickets.categoryBillet,
      rightColX,
      gridStartY + 10,
      'right'
    );

    // Ligne pointillée inférieure
    const bottomLineY = gridStartY + 18;
    doc.setLineDash([1, 1]);
    doc.line(
      ticketSection.x,
      bottomLineY,
      ticketSection.x + ticketSection.width,
      bottomLineY
    );

    // Cercles sur la ligne avec effet de trou réduit
    doc.setFillColor(42, 42, 42);
    const circleRadius = 2.5; // Réduit de 4 à 2.5

    // Cercles gauche et droit
    doc.circle(ticketSection.x, bottomLineY, circleRadius, 'F');
    doc.circle(
      ticketSection.x + ticketSection.width,
      bottomLineY,
      circleRadius,
      'F'
    );

    // QR Code
    const qrSize = 20;
    const qrX = pageWidth / 2 - qrSize / 2;
    const qrY = bottomLineY + 4;

    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, tickets.billetId, {
      width: qrSize * 4,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    const qrImageData = qrCanvas.toDataURL('image/png');
    doc.addImage(qrImageData, 'PNG', qrX, qrY, qrSize, qrSize);

    // Numéro du ticket
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `N°${String(tickets.number).padStart(8, '0')}`,
      pageWidth / 2,
      qrY + qrSize + 3,
      { align: 'center' }
    );

    // Sauvegarde du PDF
    const fileName = `TICKET_${tickets.eventName.replace(/\s+/g, '_')}_${tickets.number}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
export const formatDateStyled = (dateString) => {
  const date = new Date(dateString);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  return `${days[date.getDay()]}, ${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'short' })}`;
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export { loadFirebaseImage, loadFirebaseImageWithRetry };
