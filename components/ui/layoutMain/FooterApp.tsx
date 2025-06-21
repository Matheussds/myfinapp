import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDateToMonthYear } from "@utils/DateFormatter";
import { colors, spacing, borderRadius, shadows } from '../../../utils/designSystem';
import Text from '../base/Text';

type Props = {
    onDateChange: (monthYear: string) => void;
}

const formatDate = (month: number, year: number) => {
    const date = new Date(year, month);
    const monthName = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
    return `${monthName}/${year}`;
};

export default function FooterApp({ onDateChange }: Props) {
    const [date, setDate] = useState(new Date());

    const handleIncrease = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + 1);
        setDate(newDate);
        const newMonthYear = formatDateToMonthYear(newDate);
        console.log('FooterApp: aumentando data para:', newMonthYear);
        onDateChange(newMonthYear);
    };

    const handleDecrease = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() - 1);
        setDate(newDate);
        const newMonthYear = formatDateToMonthYear(newDate);
        console.log('FooterApp: diminuindo data para:', newMonthYear);
        onDateChange(newMonthYear);
    };

    return (
        <View style={styles.container}>
            {/* Botão anterior */}
            <TouchableOpacity 
                style={styles.navButton} 
                onPress={handleDecrease}
                activeOpacity={0.7}
            >
                <Ionicons name="chevron-back" size={24} color={colors.primary[500]} />
            </TouchableOpacity>

            {/* Mês/Ano atual */}
            <View style={styles.dateContainer}>
                <Text variant="h4" color="primary" weight="semibold" align="center">
                    {formatDate(date.getMonth(), date.getFullYear())}
                </Text>
            </View>

            {/* Botão próximo */}
            <TouchableOpacity 
                style={styles.navButton} 
                onPress={handleIncrease}
                activeOpacity={0.7}
            >
                <Ionicons name="chevron-forward" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderTopLeftRadius: borderRadius['2xl'],
        borderTopRightRadius: borderRadius['2xl'],
        ...shadows.md,
    },
    
    navButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    
    dateContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
});