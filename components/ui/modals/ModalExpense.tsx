import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorPicker from "../ColorPicker";
import { postMoneyExpense } from "@mocks/mockAPI";
import { Expense, Card, PaymentMethod } from "entity";
import { getCards } from "@api/cards";

/*
PaymentMethodId:
    1 - Money
    2 - PIX
    3 - Credit Card
    4 - Debit Card
*/

interface Props {
    modalVisible: boolean;
    paymentMethod: PaymentMethod;
    monthYear: string;
    onSetVisible: (isVisible: boolean) => void;
    categoryGUID: string;
    onAddExpense: (expense: Expense, day: number) => void;
}

export default function ModalExpense(props: Props) {
    const [inputCardDescription, setInputCardDescription] = useState('');
    const [inputExpenseValue, setInputExpenseValue] = useState('');
    const [inputExpenseDescription, setInputExpenseDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCard, setSelectedCard] = useState<number>(-1);

    const onSetModalVisible = (visible: boolean) => {
        setModalVisible(visible);
        setSelectedCard(-1);
        props.onSetVisible(visible);
    }

    const handleAddExpense = async () => {
        try {
            const id = await postMoneyExpense({
                value: parseFloat(inputExpenseValue),
                description: inputExpenseDescription
            }, 2025, 3, props.categoryGUID);

            const expense: Expense = {
                category_guid: props.categoryGUID,
                guid: id,
                payment_method_id: props.paymentMethod,
                spentAt: new Date(),
                is_recurring: false,
                installments: 1,
                installment_number: 1,
                value: parseFloat(inputExpenseValue),
                description: inputExpenseDescription,
                card_guid: selectedCard !== null ? cards[selectedCard].guid : undefined,
            }

            const day = new Date().getDate();
            props.onAddExpense(expense, day);

            setInputCardDescription('');
            selectedCard !== null && setSelectedCard(-1);
            setInputExpenseValue('');
            setInputExpenseDescription('');
            onSetModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    }

    const loadCards = async () => {
        try {
            const cards = await getCards();
            setCards(cards);
        } catch (error) {
            console.error("Error loading cards:", error);
        }
    }

    const onSetCard = (index: number) => {
        setSelectedCard(index);
        const card = cards[index];
        console.log(card);
    }

    useEffect(() => {
        loadCards();
        setModalVisible(props.modalVisible);
    }, [props.modalVisible]);

    // const colorBlue = '#052BC2';
    return (
        <MyModal modalVisible={modalVisible}>
            {[3, 4].includes(props.paymentMethod) && cards.length == 0 ? (
                <View style={{ width: '100%', alignItems: "center", padding: 20 }}>
                    <Text style={styles.modalText}>Adicionar um novo cartão</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do cartão..."
                        value={inputCardDescription}
                        onChangeText={(text) => setInputCardDescription(text)}
                    />
                    <ColorPicker />
                </View>
            ) : [3, 4].includes(props.paymentMethod) && (
                <View style={{ width: '100%', alignItems: "center", padding: 20 }}>
                    <Text style={styles.modalText}>Selecione o cartão</Text>
                    <FlatList
                        data={cards}
                        keyExtractor={(item) => item.guid}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={item.guid}
                                style={[styles.button, styles.cardButton, selectedCard === index ? styles.cardSelected : styles.card]}
                                onPress={() => onSetCard(index)}
                            >
                                <Text style={styles.buttonText}>
                                    {typeof item.name === "string" && item.name.trim() !== ""
                                        ? item.name
                                        : `Cartão ${index + 1}`}
                                </Text>
                            </TouchableOpacity>
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 10, alignItems: 'center' }}
                    />
                </View>
            )}

            {([1, 2].includes(props.paymentMethod) || ([3, 4].includes(props.paymentMethod) && selectedCard >= 0)) && (
                <View style={{ width: '100%', alignItems: "center", padding: 20 }}>
                    <Text style={styles.modalText}>Adicionar um novo gasto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Valor do gasto..."
                        value={inputExpenseValue}
                        onChangeText={(text) => setInputExpenseValue(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Descrição do gasto..."
                        value={inputExpenseDescription}
                        onChangeText={(text) => setInputExpenseDescription(text)}
                    />
                </View>
            )}

            <View style={{ flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonCancel]}
                    onPress={() => onSetModalVisible(false)}
                >
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonAdd]}
                    onPress={() => handleAddExpense()}
                >
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>
        </MyModal>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    button: {
        width: '50%',
        padding: 10,
    },
    cardButton: {
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    buttonCancel: {
        backgroundColor: '#da330d',
        borderRightWidth: 1,
        borderRightColor: '#ccc',
        borderTopEndRadius: 20,
    },
    buttonAdd: {
        backgroundColor: '#000',
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
        borderTopStartRadius: 20,
    },
    card: {
        width: 120,
        height: 70,
        backgroundColor: '#820AD1'
    },
    cardSelected: {
        width: 130,
        height: 80,
        backgroundColor: '#052BC2',
        borderColor: '#052BC2',
        borderWidth: 2
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
    resultText: {
        marginTop: 20,
        fontSize: 16,
    },
});
