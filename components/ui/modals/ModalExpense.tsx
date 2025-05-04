import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { postMoneyExpense } from "@mocks/mockAPI";
import { Expense, Card, PaymentMethod } from "entity";
import ButtonsSetup from "../ButtonsSetup";
import CardList from "../cards/CardList";

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
    categoryGUID: string;
    onClose: () => void;
    onAddExpense: (expense: Expense, day: number) => void;
}

export default function ModalExpense(props: Props) {
    const [inputExpenseValue, setInputExpenseValue] = useState('');
    const [inputExpenseDescription, setInputExpenseDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(props.modalVisible);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const resetAndCloseModal = () => {
        setInputExpenseValue('');
        setInputExpenseDescription('');
        setSelectedCard(null);
        setModalVisible(false);
        props.onClose();
    }

    const handleCancelAddExpense = () => {
        setModalVisible(false);
        setSelectedCard(null);
        props.onClose();
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
                card_guid: selectedCard?.guid
            }

            const day = new Date().getDate();
            props.onAddExpense(expense, day);
            resetAndCloseModal();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        setModalVisible(props.modalVisible)
    }, [props.modalVisible])

    return (
        <MyModal modalVisible={modalVisible} onClose={resetAndCloseModal}>
            {[3, 4].includes(props.paymentMethod) && (
                <CardList onSelect={setSelectedCard} onCancelAddCard={resetAndCloseModal}/>
            )}

            {([1, 2].includes(props.paymentMethod) || ([3, 4].includes(props.paymentMethod) && selectedCard != null)) && (
                <>
                    <View style={{ width: '100%', alignItems: "center", paddingHorizontal: 20 }}>
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
                    <ButtonsSetup
                        onCancel={() => handleCancelAddExpense()}
                        onAdd={handleAddExpense}
                    />
                </>
            )}
        </MyModal>
    )
}

const styles = StyleSheet.create({
    modalText: {
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
    }
});
