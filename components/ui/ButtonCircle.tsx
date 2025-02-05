import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';

export default function ButtonCircle( { backgroundColor, onPressAdd, children }: { backgroundColor: string, onPressAdd: () => void, children?: ReactNode } ) {
    return (
        <TouchableOpacity style={[styles.buttonCircle, { backgroundColor }]} onPress={onPressAdd}>
            { children ? children : <Ionicons name="add" size={40} color='#fff' /> }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonCircle: {
        borderRadius: '100%',
        padding: 14
    }
});