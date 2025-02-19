import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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

    const colorBlue = '#052BC2';

    return (
        <MyModal modalVisible={modalVisible}>
            <View style={{ width: '100%', alignItems: "center", padding: 20 }}>
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
            </View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#da330d', borderRightWidth: 1, borderRightColor: '#ccc' }]}
                    onPress={() => onSetModalVisible(false)}
                >
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colorBlue, borderLeftWidth: 1, borderLeftColor: '#ccc' }]}
                    onPress={() => onSetModalVisible(false)}
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
