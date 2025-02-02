import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ButtonCircle( { backgroundColor }: { backgroundColor: string } ) {
    return (
        <View style={[styles.buttonCircle, { backgroundColor }]}>
            <Ionicons name="add" size={40} color='#fff' />
        </View>
    )
}

const styles = StyleSheet.create({
    buttonCircle: {
        borderRadius: '100%',
        padding: 14
    }
});