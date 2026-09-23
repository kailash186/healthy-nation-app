/**
 * Theme: Ocean Depths (theme-factory)
 * A professional and calming maritime palette.
 *
 *   Deep Navy  #1a2332  headers, primary text, dark surfaces
 *   Teal       #2d8b8b  primary actions, active states
 *   Seafoam    #a8dadc  secondary accents, soft fills
 *   Cream      #f1faee  app background, text on dark
 */
export const Colors = {
  primary: '#2d8b8b', // Teal
  primaryDark: '#1f6b6b',
  secondary: '#a8dadc', // Seafoam
  accent: '#2d8b8b',
  navy: '#1a2332', // Deep Navy
  background: '#f1faee', // Cream
  lightBackground: '#ffffff',
  surface: '#ffffff',
  onPrimary: '#f1faee',
  seafoamTint: '#e3f2f2',

  light: {
    tabIconDefault: '#7b8794',
    tabIconSelected: '#2d8b8b',
    text: '#1a2332',
    textSecondary: '#4f5d6b',
    border: '#d5e6e2',
    background: '#f1faee',
  },

  status: {
    success: '#2d8b8b',
    warning: '#d9a441',
    error: '#c2503f',
    info: '#4a6fa5',
  },
} as const;

export default Colors;
