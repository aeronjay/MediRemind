export const Colors = {
  light: {
    background: '#ffffff',
    surface: '#f8f9fa',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#e2e8f0',
    secondaryForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#64748b',
    card: '#ffffff',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    tint: '#3b82f6',
    icon: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: '#3b82f6',
    
    // Medication colors
    medicationBlue: '#dbeafe',
    medicationBlueDark: '#1e40af',
    medicationGreen: '#dcfce7',
    medicationGreenDark: '#166534',
    medicationYellow: '#fef3c7',
    medicationYellowDark: '#d97706',
    medicationPurple: '#e9d5ff',
    medicationPurpleDark: '#7c3aed',
    medicationRed: '#fecaca',
    medicationRedDark: '#dc2626',
    medicationIndigo: '#e0e7ff',
    medicationIndigoDark: '#4338ca',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#334155',
    secondaryForeground: '#f8fafc',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    accent: '#1e293b',
    accentForeground: '#f8fafc',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#334155',
    input: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    card: '#1e293b',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
    tint: '#3b82f6',
    icon: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#3b82f6',
    
    // Medication colors
    medicationBlue: '#1e3a8a',
    medicationBlueDark: '#3b82f6',
    medicationGreen: '#14532d',
    medicationGreenDark: '#22c55e',
    medicationYellow: '#92400e',
    medicationYellowDark: '#f59e0b',
    medicationPurple: '#581c87',
    medicationPurpleDark: '#a855f7',
    medicationRed: '#991b1b',
    medicationRedDark: '#ef4444',
    medicationIndigo: '#312e81',
    medicationIndigoDark: '#6366f1',
  },
};

export const getMedicationColor = (color: string, isDark: boolean) => {
  const colorMap = isDark ? Colors.dark : Colors.light;
  
  switch (color) {
    case 'blue':
      return isDark ? colorMap.medicationBlue : colorMap.medicationBlue;
    case 'green':
      return isDark ? colorMap.medicationGreen : colorMap.medicationGreen;
    case 'yellow':
      return isDark ? colorMap.medicationYellow : colorMap.medicationYellow;
    case 'purple':
      return isDark ? colorMap.medicationPurple : colorMap.medicationPurple;
    case 'red':
      return isDark ? colorMap.medicationRed : colorMap.medicationRed;
    case 'indigo':
      return isDark ? colorMap.medicationIndigo : colorMap.medicationIndigo;
    default:
      return isDark ? colorMap.medicationBlue : colorMap.medicationBlue;
  }
};
