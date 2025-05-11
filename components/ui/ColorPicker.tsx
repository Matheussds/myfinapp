import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const colors: string[] = [
    'FF5733', '33FF57', '3357FF', 'F1C40F', '8E44AD', 'E74C3C',
    '3498DB', '2ECC71', '9B59B6', 'E67E22', '1ABC9C', '34495E',
    '003087', '005566', 'F58025', 'CC092F', 'EC0000', '820AD1',
    'FF6200', '008B5D', 'FFC107', '009739', '003366'
];

interface Props {
    onSelectColor: (color: string) => void;
}

export default function ColorPicker({ onSelectColor }: Props) {
    // const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        onSelectColor(color);
        // setModalVisible(false);
    };

    const renderColorItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[styles.colorBox, {
                backgroundColor: '#' + item,
                borderColor: selectedColor === item ? '#000' : '#fff',
                borderWidth: selectedColor === item ? 4 : 0
            }]}
            onPress={() => handleColorSelect(item)}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={colors}
                renderItem={renderColorItem}
                keyExtractor={(item) => item}
                // numColumns={2}
                horizontal={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        // borderWidth: 1,
        // height: 150
    },
    colorBox: {
        width: 40,
        height: 40,
        margin: 8,
        borderRadius: 5,
        // backgroundColor: '#fff'
        // borderWidth: 2,
        // borderColor: '#fff'
    }
});
