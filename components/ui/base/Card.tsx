import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../../utils/designSystem';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  style
}: CardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.lg,
    };

    // Variantes
    switch (variant) {
      case 'elevated':
        baseStyle.backgroundColor = colors.background.primary;
        baseStyle.borderRadius = borderRadius.lg;
        Object.assign(baseStyle, shadows.md);
        break;
      case 'outlined':
        baseStyle.backgroundColor = colors.background.primary;
        baseStyle.borderRadius = borderRadius.lg;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.neutral[300];
        break;
      default:
        baseStyle.backgroundColor = colors.background.primary;
        baseStyle.borderRadius = borderRadius.lg;
        Object.assign(baseStyle, shadows.sm);
    }

    // Padding
    switch (padding) {
      case 'none':
        baseStyle.padding = 0;
        break;
      case 'small':
        baseStyle.padding = spacing.sm;
        break;
      case 'large':
        baseStyle.padding = spacing.lg;
        break;
      default:
        baseStyle.padding = spacing.md;
    }

    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
} 