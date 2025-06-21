import React from "react";
import { View, StyleSheet } from "react-native";
import { PaymentMethod } from "@entity";
import { ButtonCircle } from "@ui";
import { colors, spacing } from '../../../utils/designSystem';
import Text from '../base/Text';
import { GENERAL_CATEGORY_GUID } from "@utils/constants";

interface Props {
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (paymentMethod: PaymentMethod, shouldOpenModal: boolean) => void;
    categoryTotal: number;
    categoryName?: string;
    selectedCategoryGUID?: string | null;
}

export default function FooterContext({ 
    paymentMethod, 
    onPaymentMethodChange, 
    categoryTotal,
    categoryName = "categoria",
    selectedCategoryGUID
}: Props) {
    const handleAddExpense = () => {
        console.log('FooterContext: handleAddExpense chamado - usuário clicou no botão');
        // Só chama onPaymentMethodChange quando o usuário clicar no botão
        // Isso evita que o modal abra automaticamente na inicialização
        onPaymentMethodChange(paymentMethod, true); // true = deve abrir modal
    };

    const isGeneralCategory = selectedCategoryGUID === GENERAL_CATEGORY_GUID;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.totalSection}>
                    <Text variant="caption" color="secondary" align="right">
                        Total da {categoryName}
                    </Text>
                    <Text variant="h3" color="primary" weight="bold" align="right">
                        R$ {categoryTotal.toFixed(2)}
                    </Text>
                </View>
                
                {!isGeneralCategory && (
                    <ButtonCircle 
                        backgroundColor={colors.primary[500]} 
                        onPressAdd={handleAddExpense} 
                        style={styles.addButton}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[200],
    },
    
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    
    totalSection: {
        flex: 1,
        alignItems: 'flex-end',
    },
    
    addButton: {
        marginLeft: spacing.lg,
    },
});