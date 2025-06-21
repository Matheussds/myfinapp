import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { colors, typography } from '../../../utils/designSystem';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'success' | 'warning' | 'error';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: TextStyle;
}

export default function Text({
  children,
  variant = 'body',
  color = 'primary',
  weight = 'normal',
  align = 'left',
  numberOfLines,
  style
}: TextProps) {
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: colors.text.primary,
      textAlign: align,
    };

    // Variantes de tamanho
    switch (variant) {
      case 'h1':
        baseStyle.fontSize = typography.fontSize['3xl'];
        baseStyle.fontWeight = typography.fontWeight.bold as any;
        baseStyle.lineHeight = typography.fontSize['3xl'] * typography.lineHeight.tight;
        break;
      case 'h2':
        baseStyle.fontSize = typography.fontSize['2xl'];
        baseStyle.fontWeight = typography.fontWeight.bold as any;
        baseStyle.lineHeight = typography.fontSize['2xl'] * typography.lineHeight.tight;
        break;
      case 'h3':
        baseStyle.fontSize = typography.fontSize.xl;
        baseStyle.fontWeight = typography.fontWeight.semibold as any;
        baseStyle.lineHeight = typography.fontSize.xl * typography.lineHeight.normal;
        break;
      case 'h4':
        baseStyle.fontSize = typography.fontSize.lg;
        baseStyle.fontWeight = typography.fontWeight.semibold as any;
        baseStyle.lineHeight = typography.fontSize.lg * typography.lineHeight.normal;
        break;
      case 'body':
        baseStyle.fontSize = typography.fontSize.base;
        baseStyle.fontWeight = typography.fontWeight.normal as any;
        baseStyle.lineHeight = typography.fontSize.base * typography.lineHeight.normal;
        break;
      case 'bodySmall':
        baseStyle.fontSize = typography.fontSize.sm;
        baseStyle.fontWeight = typography.fontWeight.normal as any;
        baseStyle.lineHeight = typography.fontSize.sm * typography.lineHeight.normal;
        break;
      case 'caption':
        baseStyle.fontSize = typography.fontSize.xs;
        baseStyle.fontWeight = typography.fontWeight.normal as any;
        baseStyle.lineHeight = typography.fontSize.xs * typography.lineHeight.normal;
        break;
      case 'label':
        baseStyle.fontSize = typography.fontSize.sm;
        baseStyle.fontWeight = typography.fontWeight.medium as any;
        baseStyle.lineHeight = typography.fontSize.sm * typography.lineHeight.normal;
        break;
    }

    // Cores
    switch (color) {
      case 'secondary':
        baseStyle.color = colors.text.secondary;
        break;
      case 'tertiary':
        baseStyle.color = colors.text.tertiary;
        break;
      case 'inverse':
        baseStyle.color = colors.text.inverse;
        break;
      case 'success':
        baseStyle.color = colors.success[500];
        break;
      case 'warning':
        baseStyle.color = colors.warning[500];
        break;
      case 'error':
        baseStyle.color = colors.error[500];
        break;
      default:
        baseStyle.color = colors.text.primary;
    }

    // Peso da fonte
    switch (weight) {
      case 'medium':
        baseStyle.fontWeight = typography.fontWeight.medium as any;
        break;
      case 'semibold':
        baseStyle.fontWeight = typography.fontWeight.semibold as any;
        break;
      case 'bold':
        baseStyle.fontWeight = typography.fontWeight.bold as any;
        break;
      default:
        baseStyle.fontWeight = typography.fontWeight.normal as any;
    }

    return baseStyle;
  };

  return (
    <RNText style={[getTextStyle(), style]} numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
} 