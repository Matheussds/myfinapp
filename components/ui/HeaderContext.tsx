import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonCircle from "./ButtonCircle";
import { useEffect, useState } from "react";
import ModalCategory from "./ModalCategory";

export default function HeaderContext({ onSelectCategory }: { onSelectCategory: (category: string) => void }) {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [openModalCategory, setOpenModalCategory] = useState(false);

    const handleSelectCategory = (index: number) => {
        console.log('Selecionar categoria');
        if (categories.length > 0){ 
            setSelectedCategory(index);
            onSelectCategory(categories[index]);
        };
    }

    const handleAddedCategory = (category: string) => {
        console.log('Adicionando categoria', category);
        setCategories([...categories, category]);
        handleSelectCategory(categories.length);
    }

    useEffect(() => {
        setCategories(['Geral', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros']);
        handleSelectCategory(0);
    }, []);

    return (
        <>
            <View style={styles.cardHeader}>
                <ButtonCircle backgroundColor='#000' onPressAdd={() => setOpenModalCategory(true)} />
                <View style={{ flex: 1, flexDirection: 'row', height: 70, alignItems: "center", justifyContent: 'center', backgroundColor: '#000', borderTopStartRadius: 50, borderBottomStartRadius: 50 }}>
                    <TouchableOpacity disabled={selectedCategory === 0} style={[{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }]} onPress={() => handleSelectCategory(selectedCategory - 1)}>
                        <Ionicons name="chevron-back" size={24} color={selectedCategory === 0 ? "#000" : "#fff"} />
                    </TouchableOpacity>
                    {/* Ao tocar na categoria abrir modal com todas as categorias para escolher uma */}
                    <Text style={{ fontSize: 18, color: '#fff', flex: 1, textAlign: 'center' }}>{categories[selectedCategory]}</Text>
                    <TouchableOpacity disabled={selectedCategory === categories.length - 1} style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }} onPress={() => handleSelectCategory(selectedCategory + 1)}>
                        <Ionicons name="chevron-forward" size={24} color={selectedCategory === categories.length - 1 ? "#000" : "#fff"} />
                    </TouchableOpacity>
                </View>
            </View>
            <ModalCategory modalVisible={openModalCategory} onSetVisible={setOpenModalCategory} onAddCategory={handleAddedCategory} />
        </>
    )
}

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingStart: 8
    },
})