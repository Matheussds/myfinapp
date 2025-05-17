import { PaymentMethod } from '@entity';
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    onSelectMethod: (id: PaymentMethod) => void;
}

const ModalMethod = (props: Props) => {
    const [modalVisible, setModalVisible] = useState(props.isVisible);
    const [openCardMethods, setOpenCardMethods] = useState(false);

    const handleSelectedMethod = (id: PaymentMethod) => {
        props.onSelectMethod(id);
        setOpenCardMethods(false);
        setModalVisible(false);
    }

    const handleCloseModal = () => {
        setModalVisible(false);
        props.onClose();
    }

    useEffect(() => {
        setModalVisible(props.isVisible);
    }, [props.isVisible])

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {!openCardMethods ?
                        <>
                            <View style={styles.methods}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setOpenCardMethods(true)}
                                >
                                    <Text style={{ textAlign: "center" }}>
                                        <FontAwesome6 name="credit-card" size={36} color={'#052BC2'} />
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleSelectedMethod(PaymentMethod.PIX)}
                                >
                                    <Text style={{ textAlign: "center" }}>
                                        <FontAwesome6 name="pix" size={36} color="#052BC2" />
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleSelectedMethod(PaymentMethod.Money)}
                                >
                                    <Text style={{ textAlign: "center" }}>
                                        <FontAwesome6 name="money-bill-1" size={36} color="#052BC2" />
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCloseModal}
                            >
                                <Text style={styles.closeButtonText}>Voltar</Text>
                            </TouchableOpacity>
                        </>
                        :
                        <>
                            <View style={styles.methods}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleSelectedMethod(PaymentMethod.Credit)}
                                >
                                    <Text style={styles.cardMethodText}>Crédito</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleSelectedMethod(PaymentMethod.Debit)}
                                >
                                    <Text style={styles.cardMethodText}>Débito</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setOpenCardMethods(false)}
                            >
                                <Text style={styles.closeButtonText}>Voltar</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#052BC2',
        backgroundColor: '#fff',
        height: 90,
        flex: 1,
        borderRadius: 10,
        borderWidth: 2
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // Manter o modal na parte inferior
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    },
    modalContent: {
        backgroundColor: "#E8E2E2",
        borderRadius: 10,
        alignItems: 'center'
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        width: '100%',
        backgroundColor: '#da330d',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    cardMethodText: {
        color: '#052BC2',
        fontSize: 16,
    },
    methods: {
        flexDirection: 'row',
        gap: 8,
        padding: 20,
    }
});

export default ModalMethod;