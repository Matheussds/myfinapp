import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../utils/designSystem';
import Text from './base/Text';

interface RowDateProps {
    value: number;
    month: string;
    date: string;
    color: 'success' | 'warning' | 'error' | 'primary';
}

export default function RowDate({ value, month, date, color }: RowDateProps) {
    const getColorValue = () => {
        switch (color) {
            case 'success':
                return colors.success[500];
            case 'warning':
                return colors.warning[500];
            case 'error':
                return colors.error[500];
            default:
                return colors.primary[500];
        }
    };

    return (
        <View style={styles.container}>
            {/* Tag do valor do dia */}
            <View style={[styles.valueTag, { backgroundColor: getColorValue() }]}>
                <Text variant="caption" color="inverse" weight="bold">
                    R$ {value.toFixed(2)}
                </Text>
            </View>

            {/* Data formatada */}
            <View style={styles.dateSection}>
                <Text variant="bodySmall" color="inverse" weight="medium">
                    {date} - {month}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.primary[500],
        borderRadius: borderRadius.md,
        marginVertical: spacing.xs,
        ...shadows.sm,
    },
    
    valueTag: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        minWidth: 80,
        alignItems: 'center',
    },
    
    dateSection: {
        flex: 1,
        alignItems: 'flex-end',
    },
});