import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';

const colors: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C',
    '#3498DB', '#2ECC71', '#9B59B6', '#E67E22', '#1ABC9C', '#34495E'
];

const ColorPicker: React.FC = () => {
    // const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        // setModalVisible(false);
    };

    const renderColorItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[styles.colorBox, {
                backgroundColor: item,
                borderColor: selectedColor === item ? '#0ff' : '#fff',
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
        // borderWidth: 1,
        // borderColor: '#000',
        // height: 150
    },
    colorBox: {
        width: 60,
        height: 60,
        margin: 8,
        borderRadius: 5,
        // borderWidth: 2,
        // borderColor: '#fff'
    }
});

export default ColorPicker;