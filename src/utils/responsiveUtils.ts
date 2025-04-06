
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

/**
 * Get responsive grid columns configuration
 * @param mobile Number of columns for mobile screens
 * @param tablet Number of columns for tablet screens
 * @param desktop Number of columns for desktop screens
 * @returns Tailwind class string for responsive grid columns
 */
export const responsiveGridCols = (
  mobile: number = 1,
  tablet: number = 2,
  desktop: number = 3
): string => {
  return `grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`;
};

/**
 * Get responsive padding configuration
 * @param base Base padding for all screens
 * @param sm Padding for small screens (640px and up)
 * @param md Padding for medium screens (768px and up)
 * @param lg Padding for large screens (1024px and up)
 * @returns Tailwind class string for responsive padding
 */
export const responsivePadding = (
  base: string = "p-2",
  sm: string = "p-4",
  md: string = "p-6",
  lg: string = "p-8"
): string => {
  return `${base} sm:${sm} md:${md} lg:${lg}`;
};
