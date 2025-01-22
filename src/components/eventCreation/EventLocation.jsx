import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Navigation } from 'lucide-react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MapLoading, MapError } from './MapLoadingError';

const libraries = ['places'];

const locationData = {
  countries: [
    { value: 'congo', label: 'République du Congo' },
    { value: 'drc', label: 'République Démocratique du Congo' },
  ],
  cities: {
    congo: [
      { value: 'brazzaville', label: 'Brazzaville' },
      { value: 'pointe-noire', label: 'Pointe-Noire' },
      { value: 'dolisie', label: 'Dolisie' },
    ],
    drc: [
      { value: 'kinshasa', label: 'Kinshasa' },
      { value: 'lubumbashi', label: 'Lubumbashi' },
      { value: 'goma', label: 'Goma' },
    ],
  },
};

const EventLocation = ({ formData, handleChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({
    lat: -4.4419,
    lng: 15.2663,
  });
  const [placePredictions, setPlacePredictions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userPosition, setUserPosition] = useState(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  const mapContainerStyle = {
    width: '100%',
    height: isMobile ? '300px' : isTablet ? '350px' : '400px',
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY, // Votre clé API Google Maps
    libraries,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, [isLoaded]);

  const extractPlaceName = (address) => {
    if (!address) return '';
    const parts = address.split(',');
    return parts[0].trim();
  };

  const handleMapClick = async (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    setMarkerPosition({ lat: clickedLat, lng: clickedLng });

    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        location: { lat: clickedLat, lng: clickedLng },
        language: 'fr',
      });

      if (response.results[0]) {
        const place = response.results[0];
        let venueName = '';

        for (const result of response.results) {
          if (
            result.types.includes('point_of_interest') ||
            result.types.includes('establishment')
          ) {
            venueName = result.name;
            break;
          }
        }

        if (!venueName) {
          venueName = extractPlaceName(place.formatted_address);
        }

        handleChange('location', {
          ...formData.location,
          venue: venueName,
          address: place.formatted_address,
          coordinates: `${clickedLat},${clickedLng}`,
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const fetchPlacePredictions = useCallback(
    async (input) => {
      if (!autocompleteService.current) return;

      const request = {
        input,
        types: ['establishment', 'geocode'],
        language: 'fr',
      };

      if (userPosition) {
        request.location = new window.google.maps.LatLng(userPosition);
        request.radius = 50000;
      }

      if (formData.location.country) {
        request.componentRestrictions = {
          country: formData.location.country === 'congo' ? 'CG' : 'CD',
        };
      }

      try {
        const result = await new Promise((resolve, reject) => {
          autocompleteService.current.getPlacePredictions(
            request,
            (predictions, status) => {
              if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                reject(status);
              }
              resolve(predictions || []);
            }
          );
        });
        setPlacePredictions(result);
      } catch (error) {
        console.error('Prediction error:', error);
        setPlacePredictions([]);
      }
    },
    [userPosition, formData.location.country]
  );

  const handlePlaceSelect = async (prediction) => {
    if (!prediction || !placesService.current) return;

    const request = {
      placeId: prediction.place_id,
      fields: ['name', 'formatted_address', 'geometry'],
      language: 'fr',
    };

    try {
      const place = await new Promise((resolve, reject) => {
        placesService.current.getDetails(request, (place, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
            reject(status);
          }
          resolve(place);
        });
      });

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setMarkerPosition(location);
      map?.panTo(location);

      handleChange('location', {
        ...formData.location,
        venue: place.name || extractPlaceName(place.formatted_address),
        address: place.formatted_address,
        coordinates: `${location.lat},${location.lng}`,
      });
    } catch (error) {
      console.error('Place details error:', error);
    }
  };

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;
    handleChange('location', {
      ...formData.location,
      country: newCountry,
      city: '',
      venue: '',
      address: '',
      coordinates: '',
    });
    setInputValue('');
    setPlacePredictions([]);
  };

  const handleCityChange = (event) => {
    const newCity = event.target.value;
    handleChange('location', {
      ...formData.location,
      city: newCity,
    });
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserPosition(pos);
          setMarkerPosition(pos);
          map?.panTo(pos);

          const geocoder = new window.google.maps.Geocoder();
          try {
            const response = await geocoder.geocode({
              location: pos,
              language: 'fr',
            });

            if (response.results[0]) {
              const place = response.results[0];
              let venueName = '';

              for (const result of response.results) {
                if (
                  result.types.includes('point_of_interest') ||
                  result.types.includes('establishment')
                ) {
                  venueName = result.name;
                  break;
                }
              }

              if (!venueName) {
                venueName = extractPlaceName(place.formatted_address);
              }

              handleChange('location', {
                ...formData.location,
                venue: venueName,
                address: place.formatted_address,
                coordinates: `${pos.lat},${pos.lng}`,
              });
            }
          } catch (error) {
            console.error('Geocoding error:', error);
          }

          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLoading(false);
          alert('Erreur de géolocalisation');
        }
      );
    }
  };

  if (loadError) return <MapError />;
  if (!isLoaded) return <MapLoading />;

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          '& > *': { flex: '1' },
        }}
      >
        <FormControl>
          <InputLabel>Pays</InputLabel>
          <Select
            fullWidth
            value={formData.location.country}
            onChange={handleCountryChange}
            label="Pays"
            size="medium"
          >
            <MenuItem value="">Sélectionnez un pays</MenuItem>
            {locationData.countries.map((country) => (
              <MenuItem key={country.value} value={country.value}>
                {country.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Ville</InputLabel>
          <Select
            value={formData.location.city}
            onChange={handleCityChange}
            label="Ville"
            disabled={!formData.location.country}
            size="medium"
          >
            <MenuItem value="">Sélectionnez une ville</MenuItem>
            {formData.location.country &&
              locationData.cities[formData.location.country].map((city) => (
                <MenuItem key={city.value} value={city.value}>
                  {city.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Autocomplete
                fullWidth
                freeSolo
                size={isMobile ? 'small' : 'medium'}
                options={placePredictions}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.description
                }
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  if (newInputValue.length >= 3) {
                    fetchPlacePredictions(newInputValue);
                  }
                }}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue !== 'string') {
                    handlePlaceSelect(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Recherchez un lieu..."
                    size="medium"
                  />
                )}
              />

              <Button
                variant="contained"
                onClick={getCurrentLocation}
                disabled={isLoading}
                startIcon={<Navigation size={20} />}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  fontSize: '12px',
                  borderRadius: '5px',
                  minWidth: { xs: '100%', sm: 'auto' },
                  height: { xs: '45px', sm: 'auto' },
                }}
              >
                Ma position
              </Button>
            </Box>

            <Box
              sx={{
                height: { xs: '300px', sm: '350px', md: '400px' },
                width: '100%',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={markerPosition}
                zoom={15}
                onLoad={onMapLoad}
                onClick={handleMapClick}
                options={{
                  styles: [
                    {
                      elementType: 'geometry',
                      stylers: [{ color: '#242f3e' }],
                    },
                    {
                      elementType: 'labels.text.fill',
                      stylers: [{ color: '#746855' }],
                    },
                  ],
                }}
              >
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={handleMapClick}
                />
              </GoogleMap>
            </Box>

            <TextField
              label="Lieu"
              fullWidth
              size="medium"
              value={formData.location.venue}
              onChange={(e) =>
                handleChange('location', {
                  ...formData.location,
                  venue: e.target.value,
                })
              }
              placeholder="Ex: Stade des Martyrs"
            />

            <TextField
              label="Adresse complète"
              fullWidth
              size="medium"
              value={formData.location.address}
              onChange={(e) =>
                handleChange('location', {
                  ...formData.location,
                  address: e.target.value,
                })
              }
            />

            <TextField
              label="Coordonnées GPS"
              fullWidth
              size="medium"
              value={formData.location.coordinates}
              InputProps={{
                readOnly: true,
              }}
              sx={{ bgcolor: 'action.disabledBackground' }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventLocation;
