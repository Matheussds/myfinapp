import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { PaymentMethod } from "@entity";
import MyModal from "./Modal";
import { colors, spacing, borderRadius, shadows } from "../../../utils/designSystem";
import Text from "../base/Text";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    modalVisible: boolean;
    onClose: () => void;
    onSelectPaymentMethod: (paymentMethod: PaymentMethod) => void;
}

export default function ModalPaymentMethod({ 
    modalVisible, 
    onClose, 
    onSelectPaymentMethod 
}: Props) {
    const paymentMethods = [
        {
            id: 1 as PaymentMethod,
            name: "Dinheiro",
            icon: "cash-outline",
            description: "Pagamento em dinheiro",
            color: colors.success[500]
        },
        {
            id: 2 as PaymentMethod,
            name: "PIX",
            icon: "phone-portrait",
            description: "Transferência PIX",
            color: colors.primary[500]
        },
        {
            id: 3 as PaymentMethod,
            name: "Cartão de Crédito",
            icon: "card-outline",
            description: "Cartão de crédito",
            color: colors.secondary[500]
        },
        {
            id: 4 as PaymentMethod,
            name: "Cartão de Débito",
            icon: "card-outline",
            description: "Cartão de débito",
            color: colors.neutral[600]
        }
    ];

    const handleSelectMethod = (paymentMethod: PaymentMethod) => {
        onSelectPaymentMethod(paymentMethod);
        onClose();
    };

    return (
        <MyModal modalVisible={modalVisible} onClose={onClose} showCloseButton={true}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text variant="h3" color="primary" weight="bold" align="center">
                        Forma de Pagamento
                    </Text>
                    <Text variant="body" color="tertiary" align="center" style={styles.subtitle}>
                        Escolha como você pagou este gasto
                    </Text>
                </View>

                <View style={styles.methodsContainer}>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={styles.methodButton}
                            onPress={() => handleSelectMethod(method.id)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.methodIcon, { backgroundColor: method.color + '15' }]}>
                                <Ionicons 
                                    name={method.icon as any} 
                                    size={28} 
                                    color={method.color} 
                                />
                            </View>
                            <View style={styles.methodInfo}>
                                <Text variant="body" color="primary" weight="semibold">
                                    {method.name}
                                </Text>
                                <Text variant="caption" color="tertiary">
                                    {method.description}
                                </Text>
                            </View>
                            <View style={styles.arrowContainer}>
                                <Ionicons 
                                    name="chevron-forward" 
                                    size={20} 
                                    color={colors.neutral[400]} 
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </MyModal>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: spacing.xl,
    },
    
    header: {
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    
    subtitle: {
        marginTop: spacing.sm,
        lineHeight: 20,
    },
    
    methodsContainer: {
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.background.secondary,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        ...shadows.sm,
    },
    
    methodIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    
    methodInfo: {
        flex: 1,
        gap: spacing.xs,
    },
    
    arrowContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});