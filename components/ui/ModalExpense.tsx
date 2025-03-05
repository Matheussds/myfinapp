import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorPicker from "./ColorPicker";
import { postMoneyExpense } from "@/mocks/mockAPI";

export type Expense = {
    date: string;
    year: number;
    month: number;
    value: number;
    description: string;
}

export default function ModalExpense(props: { modalVisible: boolean, paymentMethod: 'CARD' | 'MONEY', onSetVisible: (isVisible: boolean) => void, categoryID: string, onAddExpense: (expense: Expense) => void }) {
    const [inputCardDescription, setInputCardDescription] = useState('');
    const [inputExpenseValue, setInputExpenseValue] = useState('');
    const [inputExpenseDescription, setInputExpenseDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [cards, setCards] = useState<{ name: string }[]>([]);
    const [selectedCard, setSelectedCard] = useState<number | null>(null);

    const onSetModalVisible = (visible: boolean) => {
        setModalVisible(visible);
        props.onSetVisible(visible);
    }

    const handleAddExpense = async () => {
        try {
            const id = await postMoneyExpense({
                value: parseFloat(inputExpenseValue),
                description: inputExpenseDescription
            }, 2025, 3, props.categoryID);

            const expense: Expense = {
                date: "04/03",
                year: 2025,
                month: 3,
                value: parseFloat(inputExpenseValue),
                description: inputExpenseDescription
            }

            props.onAddExpense(expense);

            setInputExpenseValue('');
            setInputExpenseDescription('');
            onSetModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setModalVisible(props.modalVisible);
    }, [props.modalVisible]);

    const colorBlue = '#052BC2';
    return (
        <MyModal modalVisible={modalVisible}>
            {props.paymentMethod === 'CARD' && cards.length == 0 ? (
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
            ) : props.paymentMethod === "CARD" && (
                <View style={{ width: '100%', alignItems: "center", padding: 20 }}>
                    <Text style={styles.modalText}>Selecione o cartão</Text>
                    {cards.map((card, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.button, { backgroundColor: selectedCard === index ? colorBlue : '#ccc' }]}
                            onPress={() => setSelectedCard(index)}
                        >
                            <Text style={styles.buttonText}>{card.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {(props.paymentMethod === "MONEY" || (props.paymentMethod === 'CARD' && selectedCard)) && (
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

            <View style={{ flexDirection: 'row', width: '100%', borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onSetModalVisible(false)}
                >
                    <Text style={[styles.buttonText, { color: '#da330d' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colorBlue, borderTopStartRadius: 50, borderBottomStartRadius: 50 }]}
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
