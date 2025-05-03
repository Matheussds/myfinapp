import { useEffect, useState } from "react";
import MyModal from "./Modal";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    const [isLoading, setIsLoading] = useState(false);

    const onSetModalVisible = (visible: boolean) => {
        setModalVisible(visible);
        props.onSetVisible(visible);
    }

    const addCategory = async () => {
        try {
            let category: Category = {
                name: inputValue
            }
            setIsLoading(true);
            category = await postCategory(category);
            console.log("Category added:", category);
            if (!category) {
                setIsLoading(false);
                Alert.alert("Error", "Failed to add category. Please try again.");
                return;
            }
            props.onAddCategory(category);
            setInputValue('');
            onSetModalVisible(false);
            setIsLoading(false);
        } catch (error) {
            // console.error("Error adding category:", error);
            setIsLoading(false);
            Alert.alert("Error", "Failed to add category. Please try again.");
        }
    }

    useEffect(() => {
        setModalVisible(props.modalVisible);
    }, [props.modalVisible])

    return (
        <MyModal modalVisible={modalVisible}>
            {isLoading
                ?
                <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.resultText}>Adicionando...</Text>
                </View>
                :
                <>
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
                            style={[styles.button, styles.buttonCancel]}
                            onPress={() => onSetModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonAdd]}
                            onPress={addCategory}
                        >
                            <Text style={styles.buttonText}>Adicionar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }
        </MyModal >
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
    buttonLeft: {
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    buttonRight: {
        borderLeftWidth: 1,
        borderLeftColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
