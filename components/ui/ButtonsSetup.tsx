import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../utils/designSystem';
import Button from './base/Button';

interface Props {
    onCancel: () => void;
    onAdd: () => void;
    addDisabled: boolean;
}

export default function ButtonsSetup({ onAdd, onCancel, addDisabled }: Props) {
    return (
        <View style={styles.container}>
            <Button
                title="Cancelar"
                onPress={onCancel}
                variant="outline"
                size="large"
                fullWidth
                style={styles.cancelButton}
            />
            
            <Button
                title="Adicionar"
                onPress={onAdd}
                variant="primary"
                size="large"
                disabled={addDisabled}
                fullWidth
                style={styles.addButton}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        gap: spacing.sm,
    },
    
    cancelButton: {
        flex: 1,
    },
    
    addButton: {
        flex: 1,
    },
});
