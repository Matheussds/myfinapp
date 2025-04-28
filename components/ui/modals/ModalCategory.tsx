import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Category } from "entity";
import { postCategory } from "@api/categories";

interface Props {
    modalVisible: boolean;
    onSetVisible: (isVisible: boolean) => void;
    onAddCategory: (category: Category) => void;
}

export default function ModalCategory(props: Props) {
    const [inputValue, setInputValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const onSetModalVisible = (visible: boolean) => {
        setModalVisible(visible);
        props.onSetVisible(visible);
    }

    const addCategory = async () => {
        try {
            let category: Category = {
                name: inputValue
            }
            category = await postCategory(category);
            props.onAddCategory(category);
            setInputValue('');
            onSetModalVisible(false);
        } catch (error) {
            console.error("Error adding category:", error);
        }
    }

    useEffect(() => {
        setModalVisible(props.modalVisible);
    }, [props.modalVisible])

    return (
        <MyModal modalVisible={modalVisible}>
            <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
                <Text style={styles.modalText}>Adicionar uma nova categoria</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite a categoria aqui..."
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
                    style={[styles.button, { backgroundColor: '#000', borderLeftWidth: 1, borderLeftColor: '#ccc' }]}
                    onPress={addCategory}
                >
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>
        </MyModal>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center'
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
