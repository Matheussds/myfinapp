// Design System - MyFinApp
// Sistema de design unificado para melhorar consistência e UX

export const colors = {
  // Cores primárias
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Cor principal do app
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Cores secundárias
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },
  
  // Cores de estado
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
  },
  
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
  },
  
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
  },
  
  // Cores neutras
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Cores de fundo
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#E9ECEF',
  },
  
  // Cores de texto
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    inverse: '#FFFFFF',
  }
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Componentes base reutilizáveis
export const components = {
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  
  button: {
    primary: {
      backgroundColor: colors.primary[500],
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary[500],
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
  },
  
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
};

// Utilitários
export const utils = {
  // Função para criar gradientes
  gradient: {
    primary: ['#2196F3', '#1976D2'],
    success: ['#4CAF50', '#388E3C'],
    warning: ['#FF9800', '#F57C00'],
    error: ['#F44336', '#D32F2F'],
  },
  
  // Função para animações
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },
}; 