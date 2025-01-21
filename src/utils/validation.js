export const validateStep = (currentStep, formData) => {
  switch (currentStep) {
    case 1:
      if (!formData.name.trim() || !formData.description.trim()) {
        return false;
      }
      return true;

    case 2:
      if (!formData.category) {
        return false;
      }
      return true;

    case 3:
      const { country, city, venue, address, coordinates } = formData.location;
      if (!country || !city || !venue || !address || !coordinates) {
        return false;
      }
      if (!validateCoordinates(coordinates)) {
        return false;
      }
      return true;

    case 4:
      const { date, startTime, endTime } = formData.datetime;
      if (!date || !startTime) {
        return false;
      }
      if (endTime && !validateTimes(startTime, endTime)) {
        return false;
      }
      return true;

    case 5:
      if (formData.selectedTicketTypes.length === 0) {
        return false;
      }
      return true;

    case 6:
      let isValid = true;
      formData.selectedTicketTypes.forEach((type) => {
        const ticket = formData.tickets[type];
        if (!ticket.price || !ticket.quantity) {
          isValid = false;
        }
      });
      return isValid;

    case 7:
      if (!formData.media.image) {
        return false;
      }
      return true;

    default:
      return true;
  }
};

export const validateCoordinates = (coordinates) => {
  if (!coordinates) return false;

  const [lat, lng] = coordinates.split(',').map((coord) => coord.trim());

  const latRegex = /^-?([0-8]?\d|90)(\.\d+)?$/;
  const lngRegex = /^-?((1[0-7]\d)|([0-9]?\d))(\.\d+)?$/;

  if (!lat || !lng) return false;
  if (!latRegex.test(lat) || !lngRegex.test(lng)) return false;

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  return (
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
  );
};

export const validateTimes = (startTime, endTime) => {
  if (!startTime) return false;

  if (!endTime) return true;

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;

  return startInMinutes < endInMinutes;
};
