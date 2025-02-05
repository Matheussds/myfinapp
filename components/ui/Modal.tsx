import { ReactNode, useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

const MyModal = (props: { modalVisible: boolean, children: ReactNode }) => {
    const [modalVisible, setModalVisible] = useState(false);
   
    useEffect(() => {
        setModalVisible(props.modalVisible);
    }, [props.modalVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    {props.children}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Manter o modal na parte inferior
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Para Android
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

export default MyModal;