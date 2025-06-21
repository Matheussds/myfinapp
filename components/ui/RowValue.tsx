import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../utils/designSystem';
import Text from './base/Text';

type Props = {
    value: number;
    currentInstallment?: number;
    totalInstallments?: number;
    description: string;
    color?: string;
    onPress?: () => void;
}

export default function RowValue({ 
    value, 
    currentInstallment, 
    totalInstallments, 
    description, 
    color = colors.primary[500],
    onPress 
}: Props) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container 
            style={styles.container}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            {/* Valor principal */}
            <View style={styles.valueSection}>
                <Text 
                    variant="h4" 
                    color="primary" 
                    weight="bold"
                    style={{ color }}
                >
                    {formatter.format(value)}
                </Text>
            </View>

            {/* Informações de parcela (se aplicável) */}
            {currentInstallment && totalInstallments && (
                <View style={styles.installmentSection}>
                    <Text variant="caption" color="secondary" align="center">
                        {currentInstallment} de {totalInstallments}
                    </Text>
                </View>
            )}

            {/* Descrição */}
            <View style={styles.descriptionSection}>
                <Text 
                    variant="body" 
                    color="secondary" 
                    weight="medium"
                    align="right"
                    numberOfLines={2}
                >
                    {description}
                </Text>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: 56,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.md,
        marginVertical: spacing.xs,
        ...shadows.sm,
    },
    
    valueSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    
    installmentSection: {
        flex: 0.5,
        alignItems: 'center',
        paddingHorizontal: spacing.xs,
    },
    
    descriptionSection: {
        flex: 1.5,
        alignItems: 'flex-end',
        paddingLeft: spacing.sm,
    },
});