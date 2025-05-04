import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    onCancel: () => void;
    onAdd: () => void;
}

export default function ButtonsSetup({ onAdd, onCancel }: Props) {
    //TODO Implementar o desabilitar botão.
    return (
        <View style={{ flexDirection: 'row', width: '100%' }}>
            <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => onCancel()}
            >
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.buttonAdd]}
                onPress={() => onAdd()}
            >
                <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
    },
    button: {
        width: '50%',
        padding: 10,
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
});
