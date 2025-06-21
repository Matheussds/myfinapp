import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../utils/designSystem';
import Text from './base/Text';

interface Props {
    onSetOpenParcelas: (open: boolean) => void;
    isOpenParcelas: boolean;
    showInstallmentsOption?: boolean;
}

export default function ChooseDisplay({ onSetOpenParcelas, isOpenParcelas, showInstallmentsOption = true }: Props) {
    const handleToggle = (showParcelas: boolean) => {
        onSetOpenParcelas(showParcelas);
    };

    return (
        <View style={styles.container}>
            {/* Botão Á Vista */}
            <TouchableOpacity 
                style={[
                    styles.button, 
                    !showInstallmentsOption ? styles.fullWidthButton : styles.leftButton,
                    !isOpenParcelas && styles.activeButton
                ]}
                onPress={() => handleToggle(false)}
                activeOpacity={0.8}
            >
                <Text 
                    variant="body" 
                    color={!isOpenParcelas ? 'inverse' : 'secondary'} 
                    weight="medium"
                    align="center"
                >
                    Á Vista
                </Text>
            </TouchableOpacity>

            {/* Botão Parcelas - só mostra se showInstallmentsOption for true */}
            {showInstallmentsOption && (
                <TouchableOpacity 
                    style={[
                        styles.button, 
                        styles.rightButton,
                        isOpenParcelas && styles.activeButton
                    ]}
                    onPress={() => handleToggle(true)}
                    activeOpacity={0.8}
                >
                    <Text 
                        variant="body" 
                        color={isOpenParcelas ? 'inverse' : 'secondary'} 
                        weight="medium"
                        align="center"
                    >
                        Parcelas
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: colors.neutral[100],
        borderRadius: borderRadius.lg,
        padding: 2,
        ...shadows.sm,
    },
    
    button: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
    },
    
    leftButton: {
        borderTopLeftRadius: borderRadius.lg,
        borderBottomLeftRadius: borderRadius.lg,
    },
    
    fullWidthButton: {
        borderTopLeftRadius: borderRadius.lg,
        borderBottomLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
    },
    
    rightButton: {
        borderTopRightRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
    },
    
    activeButton: {
        backgroundColor: colors.primary[500],
        ...shadows.sm,
    },
});