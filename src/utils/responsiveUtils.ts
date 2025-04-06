
/**
 * Utility functions for handling responsive design aspects
 */

/**
 * Get class names based on screen size
 * @param base Base class names for all screen sizes
 * @param sm Class names for small screens (640px and up)
 * @param md Class names for medium screens (768px and up)
 * @param lg Class names for large screens (1024px and up)
 * @param xl Class names for extra large screens (1280px and up)
 * @returns Combined class names string
 */
export const responsiveClasses = (
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string => {
  return [
    base,
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : '',
  ].filter(Boolean).join(' ');
};

/**
 * Check if we're on a mobile device
 * @returns True if viewport width is less than 768px
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};
