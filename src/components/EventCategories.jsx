/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useCategoryStore } from '../features/events/stores/useCategoryStore';

const elegantTeal = {
  light: '#131313',
  main: '#3ECF8E',
  dark: '#3ECF8E',
};

const CenteredContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  marginLeft: '2px',

  [theme.breakpoints.down('sm')]: {
    borderTop: 'solid 1px #292828',
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  '-ms-overflow-style': 'none',
  padding: theme.spacing(1, 0),
  maxWidth: '100%',
  scrollBehavior: 'smooth',
}));

const CategoryButton = styled(Typography)(({ theme, active, isMobile }) => ({
  padding: theme.spacing(1, 1.5),
  borderRadius: 18,
  cursor: 'pointer',
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  backgroundColor: active ? elegantTeal.main : '#232323',
  color: active ? '#131313' : '#F1F1F1',
  fontWeight: isMobile ? 'bold' : 300,

  fontSize: isMobile ? '0.75rem' : '0.875rem',
  '&:hover': {
    backgroundColor: active ? elegantTeal.dark : '#232323',
  },
}));

const ScrollButton = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  borderRadius: '50%',
  width: 28,
  height: 28,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  zIndex: 1,
}));

const categories = [
  'Tout voir',
  'Concert',
  'Showcase',
  'Théâtre',
  'Sport',
  'Spéctacle',
  'Conférence',
  'Technologie',
  'Autre...',
];

const EventCategories = () => {
  const { activeCategory, setActiveCategory } = useCategoryStore();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (direction) => {
    scrollContainerRef.current?.scrollBy({
      left: direction * scrollContainerRef.current.offsetWidth * 0.5,
      behavior: 'smooth',
    });
  };

  return (
    <CenteredContainer>
      {!isMobile && showLeftArrow && (
        <ScrollButton style={{ left: 0 }} onClick={() => scroll(-1)}>
          <ArrowBackIosNewIcon fontSize="small" />
        </ScrollButton>
      )}
      <ScrollContainer ref={scrollContainerRef}>
        {categories.map((category) => (
          <CategoryButton
            key={category}
            active={category === activeCategory}
            onClick={() => setActiveCategory(category)}
            variant="body2"
            isMobile={isMobile}
          >
            {category}
          </CategoryButton>
        ))}
      </ScrollContainer>
      {!isMobile && showRightArrow && (
        <ScrollButton style={{ right: 0 }} onClick={() => scroll(1)}>
          <ArrowForwardIosIcon fontSize="small" />
        </ScrollButton>
      )}
    </CenteredContainer>
  );
};

export default EventCategories;
