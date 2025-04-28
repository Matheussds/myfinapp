import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Switch } from 'react-native';

const ModalFull = (props: { isVisible: boolean, onClose: () => void }) => {
    const [modalVisible, setModalVisible] = useState(props.isVisible);
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const handleModalClose = () => {
        setModalVisible(false);
        props.onClose();
    }

    useEffect(() => {
        setModalVisible(props.isVisible);
    }, [props.isVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
        >
            <View style={styles.fullScreenModal}>
                <Text style={styles.modalTitle}>Configurações do Aplicativo</Text>

                {/* Exemplo de configuração: Interruptor */}
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Modo Escuro</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                {/* Botão para fechar o modal */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => handleModalClose()}
                >
                    <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'right',
    },
    fullScreenModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        // padding: 20,

    },
    modalTitle: {
        fontSize: 24,
        marginVertical: 20,
        fontWeight: 'bold',
    },
    settingItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    settingText: {
        fontSize: 18,
    },
    closeButton: {
        width: '100%',
        backgroundColor: '#000',
        padding: 10,
    },
});

export default ModalFull;