import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    value: number;
    currentInstallment?: number;
    totalInstallments?: number;
    description: string;
    color: string;
}

export default function RowValue({ value, currentInstallment, totalInstallments, description, color }: Props) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return (
        <View style={styles.valueContainer}>
            {currentInstallment === undefined ?
                <>
                    <Text style={{ width: '50%', fontSize: 20, color: color }}>{formatter.format(value)}</Text>
                    <Text style={{ width: '50%', fontSize: 16, color: 'gray', textAlign: 'right' }}>{description}</Text>
                </>
                :
                <>
                    <Text style={{ width: '33%', fontSize: 20, color: color }}>{formatter.format(value)}</Text>
                    <Text style={{ width: '33%', fontSize: 16, color: 'gray', textAlign: 'center' }}>{currentInstallment} de {totalInstallments}</Text>
                    <Text style={{ width: '33%', fontSize: 16, color: 'gray', textAlign: 'right' }}>{description}</Text>
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 40,
        paddingHorizontal: 8
    }
});