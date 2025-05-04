import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorPicker from "../ColorPicker";
import { useState } from "react";
import { Card, PaymentMethod } from "@entity";
import ButtonsSetup from "../ButtonsSetup";
import { postCard } from "@api/cards";

interface Props {
    onAddCard: (card: Card) => void;
    onCancel: () => void;
}

export default function FormAddCard({ onAddCard, onCancel }: Props) {
    const [inputCardDescription, setInputCardDescription] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethod | null>(null);
    const [color, setColor] = useState('#000000');
    const [dueDay, setDueDay] = useState<string | null>(null);
    const [closingDay, setClosingDay] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetCardForm = () => {
        setInputCardDescription('');
        setPaymentMethodId(1);
        setColor('#000000');
        setDueDay(null);
        setClosingDay(null);
    }

    const handlePaymentMethodChange = (value: number) => {
        setPaymentMethodId(value);
    }

    const submitCard = async () => {
        if (!paymentMethodId) {
            Alert.alert("Error", "Please select a payment method.");
            return;
        }

        const card: Card = {
            name: inputCardDescription,
            payment_method_id: paymentMethodId,
            closing_day: closingDay != null ? Number(closingDay) : closingDay,
            due_day: dueDay != null ? Number(dueDay) : dueDay,
            identification_color: color,
        };

        console.log("Card submitted:", card);
        if (!inputCardDescription) {
            Alert.alert("Error", "Please enter a card name.");
            return;
        }

        if (!color) {
            Alert.alert("Error", "Please select a color.");
            return;
        }

        if (paymentMethodId === 3) {
            if (!card.due_day || (card.due_day < 1 || card.due_day > 31)) {
                Alert.alert("Error", "Due day must be between 1 and 31.");
                return
            }

            if (!card.closing_day || (card.closing_day < 1 || card.closing_day > 31)) {
                Alert.alert("Error", "Closing day must be between 1 and 31.");
                return
            }
        } else {
            card.due_day = null;
            card.closing_day = null;
        }

        try {
            setIsLoading(true);
            const cardResponse = await postCard(card);
            setIsLoading(false);

            console.log("Card added:", cardResponse);
            if (!card) {
                Alert.alert("Error", "Failed to add card. Please try again.");
                return;
            }
            onAddCard(cardResponse);
        } catch (error) {
            console.error("Error submitting card:", error);
        }

        setIsLoading(false);
    }

    const handleCancel = () => {
        resetCardForm();
        onCancel();
    }

    return (
        <View style={{ width: '100%', alignItems: "center" }}>
            <Text style={styles.formTitle}>Adicionar um novo cartão</Text>
            {isLoading ? (
                <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
                    <ActivityIndicator size="large" />
                    <Text>Adicionando...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.paymentMethodContainer}>
                        <TouchableOpacity style={[styles.btnPaymentMethod, paymentMethodId == 3 && styles.methodSelected]} onPress={() => handlePaymentMethodChange(3)}>
                            <Text>Crédito</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnPaymentMethod, paymentMethodId == 4 && styles.methodSelected]} onPress={() => handlePaymentMethodChange(4)}>
                            <Text>Débito</Text>
                        </TouchableOpacity>
                    </View>

                    {paymentMethodId != null &&
                        <View style={{ padding: 20 }}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome do cartão..."
                                value={inputCardDescription}
                                onChangeText={(text) => setInputCardDescription(text)}
                            />
                            {paymentMethodId === 3 &&
                                <>
                                    <TextInput
                                        style={styles.input}
                                        value={dueDay ?? undefined}
                                        onChangeText={setDueDay}
                                        keyboardType="numeric"
                                        placeholder="Digite o dia de vencimento"
                                    />
                                    <TextInput
                                        style={styles.input}
                                        value={closingDay ?? undefined}
                                        onChangeText={setClosingDay}
                                        keyboardType="numeric"
                                        placeholder="Digite o dia de fechamento"
                                    />
                                </>
                            }
                            <ColorPicker onSelectColor={setColor} />
                        </View>
                    }
                    <ButtonsSetup onAdd={submitCard} onCancel={handleCancel} />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    formTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    paymentMethodContainer: {
        padding: 20,
        flexDirection: 'row',
        gap: 8
    },
    btnPaymentMethod: {
        height: 90,
        width: 120,
        borderRadius: 10,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    methodSelected: {
        borderWidth: 2,
        borderColor: 'blue'
    }
});
