import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { BottomTabBar } from "@react-navigation/bottom-tabs";

export default function ModalExpense(props: { modalVisible: boolean, onSetVisible: (isVisible: boolean) => void }) {
    const [inputValue, setInputValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const onSetModalVisible = (visible: boolean) => {
        setModalVisible(visible);
        props.onSetVisible(visible);
    }

    useEffect(() => {
        setModalVisible(props.modalVisible);
    }, [props.modalVisible])

    return (
        <MyModal modalVisible={modalVisible}>
            <Text style={styles.modalText}>Adicionar um novo gasto</Text>
            <TextInput
                style={styles.input}
                placeholder="Valor do gasto..."
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição do gasto..."
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Forma de pagamento..."
                value={inputValue}
                onChangeText={(text) => setInputValue(text)}
            />
            <Text style={styles.resultText}>Você digitou: {inputValue}</Text>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => onSetModalVisible(false)}
            >
                <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
        </MyModal>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: '#FF5733',
        padding: 10,
        borderRadius: 5,
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
