import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ButtonCircle( { backgroundColor, onPressAdd }: { backgroundColor: string, onPressAdd: () => void } ) {
    return (
        <TouchableOpacity style={[styles.buttonCircle, { backgroundColor }]} onPress={onPressAdd}>
            <Ionicons name="add" size={40} color='#fff' />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonCircle: {
        borderRadius: '100%',
        padding: 14
    }
});