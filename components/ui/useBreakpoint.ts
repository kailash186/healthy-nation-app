import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = { tablet: 768, desktop: 1100 } as const;

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
    /** columns for a responsive card grid */
    columns: width >= BREAKPOINTS.desktop ? 3 : width >= BREAKPOINTS.tablet ? 2 : 1,
  };
}
