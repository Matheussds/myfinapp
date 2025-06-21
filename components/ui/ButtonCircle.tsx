import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { colors, spacing, borderRadius, shadows } from '../../utils/designSystem';

interface ButtonCircleProps {
    backgroundColor: string;
    onPressAdd: () => void;
    children?: ReactNode;
    style?: ViewStyle;
}

export default function ButtonCircle({ backgroundColor, onPressAdd, children, style }: ButtonCircleProps) {
    return (
        <TouchableOpacity 
            style={[styles.buttonCircle, { backgroundColor }, style]} 
            onPress={onPressAdd}
            activeOpacity={0.8}
        >
            { children ? children : <Ionicons name="add" size={40} color={colors.text.inverse} /> }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonCircle: {
        borderRadius: borderRadius.full,
        padding: spacing.md,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    }
});