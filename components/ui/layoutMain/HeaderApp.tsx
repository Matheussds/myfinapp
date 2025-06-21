import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Limit } from '@entity';
import brasilCurrency from '@utils/CurrencyFormatter';
import { colors, spacing, borderRadius, shadows } from '../../../utils/designSystem';
import Text from '../base/Text';

interface Props {
    onOpenMenu: () => void;
    limits: Limit;
    monthTotal: number;
}

export default function HeaderApp({ onOpenMenu, limits, monthTotal }: Props) {
    return (
        <View style={styles.container}>
            {/* Header principal */}
            <View style={styles.mainHeader}>
                {/* Logo e título */}
                <View style={styles.logoSection}>
                    <Text variant="h2" color="inverse" weight="bold">
                        MyFin
                    </Text>
                </View>

                {/* Total mensal */}
                <View style={styles.totalSection}>
                    <Text variant="caption" color="inverse" align="center">
                        Total mensal
                    </Text>
                    <Text variant="h3" color="inverse" weight="bold" align="center">
                        {brasilCurrency(monthTotal)}
                    </Text>
                </View>

                {/* Botão do menu */}
                <TouchableOpacity 
                    style={styles.menuButton} 
                    onPress={onOpenMenu}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="menu" size={24} color={colors.primary[500]} />
                </TouchableOpacity>
            </View>

            {/* Informações de limite */}
            <View style={styles.limitsSection}>
                <View style={styles.limitItem}>
                    <Text variant="caption" color="inverse" align="center">
                        Limite mensal
                    </Text>
                    <Text variant="bodySmall" color="inverse" weight="medium" align="center">
                        {brasilCurrency(limits.monthly_limit)}
                    </Text>
                </View>

                <View style={styles.limitItem}>
                    <Text variant="caption" color="inverse" align="center">
                        Limite diário
                    </Text>
                    <Text variant="bodySmall" color="inverse" weight="medium" align="center">
                        {brasilCurrency(limits.daily_limit)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primary[500],
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomLeftRadius: borderRadius['2xl'],
        borderBottomRightRadius: borderRadius['2xl'],
        ...shadows.md,
    },
    
    mainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    
    logoSection: {
        flex: 1,
        alignItems: 'flex-start',
    },
    
    totalSection: {
        flex: 2,
        alignItems: 'center',
    },
    
    menuButton: {
        backgroundColor: colors.background.primary,
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    
    limitsSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: spacing.md,
    },
    
    limitItem: {
        alignItems: 'center',
        flex: 1,
    },
});