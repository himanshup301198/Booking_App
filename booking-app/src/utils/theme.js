export const colors = {
  // Brand
  primary:       '#1A1A2E',   // deep navy
  primaryLight:  '#16213E',
  accent:        '#E94560',   // vivid red-coral
  accentSoft:    '#FF6B8A',

  // Surfaces
  surface:       '#FFFFFF',
  surfaceAlt:    '#F7F8FC',
  card:          '#FFFFFF',
  border:        '#E8ECEF',

  // Text
  textPrimary:   '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',
  textInverse:   '#FFFFFF',

  // Status
  success:       '#10B981',
  successBg:     '#ECFDF5',
  warning:       '#F59E0B',
  warningBg:     '#FFFBEB',
  error:         '#EF4444',
  errorBg:       '#FEF2F2',

  // Misc
  shadow:        'rgba(26,26,46,0.10)',
  overlay:       'rgba(26,26,46,0.5)',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

export const font = {
  // Use system fonts — safe for RN without extra setup
  regular: { fontFamily: 'System', fontWeight: '400' },
  medium:  { fontFamily: 'System', fontWeight: '500' },
  semibold:{ fontFamily: 'System', fontWeight: '600' },
  bold:    { fontFamily: 'System', fontWeight: '700' },
  heavy:   { fontFamily: 'System', fontWeight: '800' },
};

export const shadow = {
  sm: {
    shadowColor:   colors.shadow,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius:  4,
    elevation:     2,
  },
  md: {
    shadowColor:   colors.shadow,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius:  8,
    elevation:     4,
  },
  lg: {
    shadowColor:   colors.shadow,
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius:  16,
    elevation:     8,
  },
};