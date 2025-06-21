import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, components } from '../../../utils/designSystem';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...components.button.primary,
    };

    // Variantes
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.neutral[100];
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.primary[500];
        break;
      case 'danger':
        baseStyle.backgroundColor = colors.error[500];
        break;
      default:
        baseStyle.backgroundColor = colors.primary[500];
    }

    // Tamanhos
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = spacing.xs;
        baseStyle.paddingHorizontal = spacing.sm;
        break;
      case 'large':
        baseStyle.paddingVertical = spacing.md;
        baseStyle.paddingHorizontal = spacing.lg;
        break;
      default:
        baseStyle.paddingVertical = spacing.sm;
        baseStyle.paddingHorizontal = spacing.md;
    }

    // Largura
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Estado desabilitado
    if (disabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium as any,
      color: colors.text.inverse,
    };

    // Variantes de texto
    switch (variant) {
      case 'secondary':
        baseTextStyle.color = colors.text.primary;
        break;
      case 'outline':
        baseTextStyle.color = colors.primary[500];
        break;
      case 'danger':
        baseTextStyle.color = colors.text.inverse;
        break;
      default:
        baseTextStyle.color = colors.text.inverse;
    }

    // Tamanhos de texto
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = typography.fontSize.sm;
        break;
      case 'large':
        baseTextStyle.fontSize = typography.fontSize.lg;
        break;
      default:
        baseTextStyle.fontSize = typography.fontSize.base;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? colors.primary[500] : colors.text.inverse} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle, icon ? { marginLeft: spacing.xs } : undefined]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
} 