import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { StyleSheet, TextInput, View } from "react-native";
import { postMoneyExpense } from "@mocks/mockAPI";
import { Expense, Card, PaymentMethod } from "entity";
import ButtonsSetup from "../ButtonsSetup";
import CardList from "../cards/CardList";
import ChooseDisplay from "../ChooseDisplay";

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
    const [inputExpenseInstallmets, setInputExpenseInstallmets] = useState('');
    const [modalVisible, setModalVisible] = useState(props.modalVisible);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [showInstallmentsInput, setShowInstallmentsInput] = useState(false);
    const [credit, setCredit] = useState(props.paymentMethod == 3);

    const resetAndCloseModal = () => {
        setInputExpenseValue('');
        setInputExpenseDescription('');
        setInputExpenseInstallmets('');
        setShowInstallmentsInput(false);
        setSelectedCard(null);
        setModalVisible(false);
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

    useEffect(() => {
        setCredit(props.paymentMethod == 3);
    }, [props.paymentMethod])

    return (
        <MyModal modalVisible={modalVisible} onClose={resetAndCloseModal}>
            <View style={{ backgroundColor: "#E8E2E2", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                {[3, 4].includes(props.paymentMethod) && (
                    <CardList onSelect={setSelectedCard} onCancelAddCard={resetAndCloseModal} credit={credit} />
                )}

                {([1, 2].includes(props.paymentMethod) || ([3, 4].includes(props.paymentMethod) && selectedCard != null)) && (
                    <>
                        <View style={{ alignItems: "center", padding: 20, gap: 8 }}>
                            {/* <Text style={styles.modalText}>Adicionar um novo gasto</Text> */}

                            {props.paymentMethod === 3 && <ChooseDisplay isOpenParcelas={showInstallmentsInput} onSetOpenParcelas={setShowInstallmentsInput} />}

                            <TextInput
                                style={styles.input}
                                placeholder="Valor do gasto"
                                keyboardType="number-pad"
                                value={inputExpenseValue}
                                onChangeText={(text) => setInputExpenseValue(text)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Descrição do gasto"
                                value={inputExpenseDescription}
                                onChangeText={(text) => setInputExpenseDescription(text)}
                            />
                            {showInstallmentsInput &&
                                <TextInput
                                    style={styles.input}
                                    placeholder="Parcelas a pagar"
                                    keyboardType="number-pad"
                                    value={inputExpenseInstallmets}
                                    onChangeText={(text) => setInputExpenseInstallmets(text)}
                                />
                            }
                        </View>
                        <ButtonsSetup
                            onCancel={resetAndCloseModal}
                            onAdd={handleAddExpense}
                        />
                    </>
                )}
            </View>
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
        width: '100%',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    }
});
