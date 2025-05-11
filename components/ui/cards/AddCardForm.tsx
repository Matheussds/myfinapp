import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorPicker from "../ColorPicker";
import { useEffect, useState } from "react";
import { Card, PaymentMethod } from "@entity";
import ButtonsSetup from "../ButtonsSetup";
import { postCard } from "@api/cards";
import DateSelector from "./DateSelector";

interface Props {
    onAddCard: (card: Card) => void;
    onCancel: () => void;
    credit: boolean;
}

export default function FormAddCard({ onAddCard, onCancel, credit }: Props) {
    const [inputCardDescription, setInputCardDescription] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState<PaymentMethod>(credit ? 3 : 4);
    const [color, setColor] = useState('#000000');
    const [dueDay, setDueDay] = useState<number | null>(1);
    const [closingDay, setClosingDay] = useState<number | null>(1);
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
            closing_day: closingDay,
            due_day: dueDay,
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

    useEffect(() => {
        setPaymentMethodId(credit ? 3 : 4);
    }, [credit])

    return (
        <View style={{ alignItems: "center" }}>
            <Text style={styles.formTitle}>Identifique um novo cartão</Text>
            {isLoading ? (
                <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
                    <ActivityIndicator size="large" />
                    <Text>Adicionando...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.formContainer}>
                        <View style={styles.paymentMethodContainer}>
                            <TouchableOpacity style={[styles.btnPaymentMethod, styles.btnLeft, paymentMethodId == 3 && styles.methodSelected]} onPress={() => handlePaymentMethodChange(3)}>
                                <Text style={[styles.methodText, paymentMethodId == 3 && styles.methodSelected]}>Crédito</Text>
                            </TouchableOpacity>
                            {/* <Text>ou</Text> */}
                            <TouchableOpacity style={[styles.btnPaymentMethod, styles.btnRight, paymentMethodId == 4 && styles.methodSelected]} onPress={() => handlePaymentMethodChange(4)}>
                                <Text style={[styles.methodText, paymentMethodId == 4 && styles.methodSelected]}>Débito</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputsContainer}>
                            {paymentMethodId === 3 &&
                                <>
                                    <View>
                                        <Text>Dia de Fechamento:</Text>
                                        <View style={{ paddingStart: 20 }} >
                                            <DateSelector onSelectDay={setClosingDay} daySelected={closingDay ? closingDay : 1} />
                                        </View>
                                    </View>
                                    <View>
                                        <Text >Dia de Vencimento:</Text>
                                        <View style={{ paddingStart: 20 }} >
                                            <DateSelector onSelectDay={setDueDay} daySelected={dueDay ? dueDay : 1} />
                                        </View>
                                    </View>
                                </>
                            }
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do cartão..."
                            value={inputCardDescription}
                            onChangeText={(text) => setInputCardDescription(text)}
                        />

                        {/* <View style={styles.separator} /> */}
                        {/* <Text>Cor do cartão:</Text> */}
                        <View style={styles.colorContainer}>
                            <ColorPicker onSelectColor={setColor} />
                        </View>
                        {/* <View style={styles.separator} /> */}
                        {/* <Text>Função:</Text> */}

                    </View>
                    <ButtonsSetup onAdd={submitCard} onCancel={handleCancel} />
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        gap: 30
    },
    formTitle: {
        paddingTop: 20,
        textAlign: 'center',
        fontSize: 18,
    },
    inputsContainer: {
        gap: 8
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    paymentMethodContainer: {
        // paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // height: 200,
        gap: 2
    },
    btnPaymentMethod: {
        height: 40,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnLeft: {
        borderStartStartRadius: 100,
        borderStartEndRadius: 100,
    },
    btnRight: {
        borderEndEndRadius: 100,
        borderEndStartRadius: 100
    },
    methodSelected: {
        borderColor: 'blue',
        backgroundColor: 'blue',
        color: '#fff',
    },
    methodText: {
        color: 'blue',
        fontSize: 16
    },
    separator: {
        height: 2,
        backgroundColor: '#ccc',
        marginVertical: 10,
        // width: '80%',
    },
    colorContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc'
    }
});
