import React, { useEffect, useState } from "react";
import MyModal from "./Modal";
import { StyleSheet, TextInput, View, Text as RNText } from "react-native";
import { Expense, Card, PaymentMethod } from "entity";
import ButtonsSetup from "../ButtonsSetup";
import CardList from "../cards/CardList";
import { useForm, Controller } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { postExpense } from "@api/expenses";
import { ExpensePostDTO } from "@api/DTOs/expenseDTO";
import { colors, spacing, borderRadius, shadows } from "../../../utils/designSystem";
import Text from "../base/Text";

/*
PaymentMethodId:
    1 - Money
    2 - PIX
    3 - Credit Card
    4 - Debit Card
*/

const schema = z.object({
    amount: z.string().refine((val) => {
        const num = parseFloat(val.replace(/\D/g, '')) / 100;
        return num > 0;
    }, {
        message: 'Informe um valor válido maior que R$ 0,00',
    }),
    description: z.string().min(1, 'Descrição obrigatória'),
    installmentsNumber: z.string().refine((val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0 && num <= 36
    }, {
        message: 'Número de parcelas deve ser entre 1 e 36'
    })
});

type FormData = z.infer<typeof schema>;

interface Props {
    modalVisible: boolean;
    paymentMethod: PaymentMethod;
    monthYear: string;
    categoryGUID: string;
    onClose: () => void;
    onAddExpense: (expenses: Expense[]) => void;
}

export default function ModalExpense(props: Props) {
    const [modalVisible, setModalVisible] = useState(props.modalVisible);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [showInstallmentsInput, setShowInstallmentsInput] = useState(false);
    const [credit, setCredit] = useState(props.paymentMethod == PaymentMethod.Credit);
    const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: 'R$ 0,00',
            description: '',
            installmentsNumber: '1'
        },
        mode: 'onChange'
    })

    const formatCurrency = (rawValue: string): string => {
        const numericValue = rawValue.replace(/\D/g, '');
        const floatValue = parseFloat(numericValue || '0') / 100;
        return floatValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const resetAndCloseModal = () => {
        reset();
        setShowInstallmentsInput(false);
        setSelectedCard(null);
        setModalVisible(false);
        props.onClose();
    }


    const handleAddExpense = async (data: FormData) => {
        try {
            const numericValue = parseFloat(data.amount.replace(/\D/g, '')) / 100;
            const installments = parseInt(data.installmentsNumber, 10);

            const expenseDTO: ExpensePostDTO = {
                description: data.description,
                value: numericValue,
                date: new Date().toISOString(),
                category_guid: props.categoryGUID,
                payment_method_id: props.paymentMethod,
                card_guid: selectedCard?.guid,
                installments: installments,
                is_recurring: false
            }

            let expenses = await postExpense(expenseDTO);

            if (expenses && expenses.length > 0) {
                props.onAddExpense(expenses);
                resetAndCloseModal();
            } else {
                console.error("Nenhuma despesa foi retornada pela API");
                // Aqui você poderia adicionar um toast ou alert para o usuário
            }
        } catch (error) {
            console.error("Erro ao adicionar despesa:", error);
            // Aqui você poderia adicionar um toast ou alert para o usuário
            // Por exemplo: Alert.alert("Erro", "Não foi possível adicionar a despesa. Tente novamente.");
        }
    }

    useEffect(() => {
        setModalVisible(props.modalVisible)
    }, [props.modalVisible])

    useEffect(() => {
        setCredit(props.paymentMethod == PaymentMethod.Credit);
    }, [props.paymentMethod])

    // Debug logs
    console.log('=== DEBUG MODAL EXPENSE ===');
    console.log('props.paymentMethod:', props.paymentMethod);
    console.log('PaymentMethod.Money:', PaymentMethod.Money);
    console.log('PaymentMethod.PIX:', PaymentMethod.PIX);
    console.log('PaymentMethod.Credit:', PaymentMethod.Credit);
    console.log('PaymentMethod.Debit:', PaymentMethod.Debit);
    console.log('selectedCard:', selectedCard);
    console.log('modalVisible:', modalVisible);
    console.log('props.modalVisible:', props.modalVisible);
    
    const shouldShowCardList = [PaymentMethod.Credit, PaymentMethod.Debit].includes(props.paymentMethod);
    const shouldShowForm = [PaymentMethod.Money, PaymentMethod.PIX].includes(props.paymentMethod) || 
                          ([PaymentMethod.Credit, PaymentMethod.Debit].includes(props.paymentMethod) && selectedCard != null);
    
    console.log('shouldShowCardList:', shouldShowCardList);
    console.log('shouldShowForm:', shouldShowForm);
    console.log('=== FIM DEBUG ===');

    return (
        <MyModal modalVisible={modalVisible} onClose={resetAndCloseModal} showCloseButton={true}>
            <View style={styles.container}>
                {shouldShowCardList && (
                    <CardList onSelect={setSelectedCard} onCancelAddCard={resetAndCloseModal} credit={credit} />
                )}

                {shouldShowForm && (
                    <>
                        <View style={styles.content}>
                            <View style={styles.header}>
                                <RNText style={styles.titleText}>
                                    Adicionar Gasto
                                </RNText>
                                <RNText style={styles.subtitleText}>
                                    Preencha os detalhes do seu gasto
                                </RNText>
                            </View>

                            <View style={styles.formSection}>
                                <View style={styles.inputGroup}>
                                    <RNText style={styles.labelText}>
                                        Valor
                                    </RNText>
                                    <Controller
                                        control={control}
                                        name="amount"
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                style={styles.input}
                                                value={value}
                                                keyboardType="numeric"
                                                onChangeText={(text) => onChange(formatCurrency(text))}
                                                placeholder="R$ 0,00"
                                                placeholderTextColor={colors.text.tertiary}
                                            />
                                        )}
                                    />
                                    {errors.amount &&
                                        <RNText style={styles.errorText}>{errors.amount.message}</RNText>
                                    }
                                </View>

                                <View style={styles.inputGroup}>
                                    <RNText style={styles.labelText}>
                                        Descrição
                                    </RNText>
                                    <Controller
                                        control={control}
                                        name="description"
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Ex: Almoço no restaurante"
                                                placeholderTextColor={colors.text.tertiary}
                                                value={value}
                                                onChangeText={onChange}
                                            />
                                        )}
                                    />
                                    {errors.description &&
                                        <RNText style={styles.errorText}>{errors.description.message}</RNText>
                                    }
                                </View>

                                {showInstallmentsInput && (
                                    <View style={styles.inputGroup}>
                                        <RNText style={styles.labelText}>
                                            Número de Parcelas
                                        </RNText>
                                        <Controller
                                            control={control}
                                            name="installmentsNumber"
                                            render={({ field: { onChange, value } }) => (
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Ex: 12"
                                                    placeholderTextColor={colors.text.tertiary}
                                                    keyboardType="numeric"
                                                    value={value}
                                                    onChangeText={onChange}
                                                />
                                            )}
                                        />
                                        {errors.installmentsNumber &&
                                            <RNText style={styles.errorText}>{errors.installmentsNumber.message}</RNText>
                                        }
                                    </View>
                                )}
                            </View>
                        </View>
                        
                        <View style={styles.buttonsSection}>
                            <RNText style={styles.testText}>TESTE - BOTÕES AQUI</RNText>
                        </View>
                    </>
                )}
            </View>
        </MyModal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },
    header: {
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        color: colors.text.primary,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 16,
        lineHeight: 20,
        color: colors.text.tertiary,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    installmentsSection: {
        marginBottom: spacing.xl,
        alignItems: 'center',
    },
    formSection: {
        gap: spacing.lg,
    },
    inputGroup: {
        gap: spacing.sm,
    },
    labelText: {
        marginBottom: spacing.xs,
        fontSize: 16,
        fontWeight: '500',
        color: colors.text.secondary,
    },
    input: {
        height: 56,
        borderColor: colors.neutral[300],
        width: '100%',
        borderWidth: 1,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background.secondary,
        paddingHorizontal: spacing.md,
        fontSize: 16,
        color: colors.text.primary,
        ...shadows.sm,
    },
    errorText: {
        color: colors.error[500],
        fontSize: 14,
        marginTop: spacing.xs,
    },
    buttonsSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    testText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        textAlign: 'center',
    },
});
