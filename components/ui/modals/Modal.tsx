import { ReactNode, useEffect, useState } from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "../../../utils/designSystem";

interface Props {
    modalVisible: boolean;
    children: ReactNode;
    onClose: () => void;
    showCloseButton?: boolean;
}

const MyModal = (props: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
   
    const handleCloseModal = () => {
        setModalVisible(false);
        props.onClose();
    }

    useEffect(() => {
        setModalVisible(props.modalVisible);
    }, [props.modalVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    {props.showCloseButton && (
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={handleCloseModal}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color={colors.text.secondary} />
                        </TouchableOpacity>
                    )}
                    {props.children}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalView: {
        width: '100%',
        backgroundColor: colors.background.primary,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
        ...shadows.lg,
    },
    closeButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        zIndex: 1,
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
});

export default MyModal;