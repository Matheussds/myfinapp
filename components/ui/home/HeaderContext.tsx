import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ButtonCircle from "@ui/ButtonCircle";
import ModalCategory from "@ui/modals/ModalCategory";
import { getCategories } from "@api";
import { Category } from "entity";

interface Props {
    onSelectCategory: (category: string) => void;
}

export default function HeaderContext({ onSelectCategory }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
    const [openModalCategory, setOpenModalCategory] = useState(false);

    const handleAddedCategory = (category: Category) => {
        setCategories([...categories, category]);
        setCategoryIndex(categories.length);
    }

    const loadCategories = async () => {
        setCategoryIndex(null);
        try {
            const categories = await getCategories();
            setCategories(categories);
            setCategoryIndex(categories ? 0 : null);
            if (categories && categories.length > 0) {
                categories[0].guid && onSelectCategory(categories[0].guid);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const chooseCategory = (position: 'PREVIOUS' | 'NEXT') => { 
        console.log('categoryIndex', categoryIndex);
        if (categoryIndex !== null) {
            if (position === 'PREVIOUS' && categoryIndex === 0) return;
            if (position === 'NEXT' && categoryIndex === categories.length - 1) return;

            const category = categories[position === 'PREVIOUS' ? categoryIndex - 1 : categoryIndex + 1];
            if (category && category.guid) {
                setCategoryIndex(position === 'PREVIOUS' ? categoryIndex - 1 : categoryIndex + 1);
                onSelectCategory(category.guid);
            }
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <>
            <View style={styles.cardHeader}>
                <ButtonCircle backgroundColor='#000' onPressAdd={() => setOpenModalCategory(true)} />
                <View style={{ flex: 1, flexDirection: 'row', height: 70, alignItems: "center", justifyContent: 'center', backgroundColor: '#000', borderTopStartRadius: 50, borderBottomStartRadius: 50 }}>
                    <TouchableOpacity disabled={categoryIndex === null || categoryIndex === 0} style={[{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }]} onPress={() => chooseCategory('PREVIOUS')}>
                        <Ionicons name="chevron-back" size={24} color={categoryIndex === null || categoryIndex === 0 ? "#000" : "#fff"} />
                    </TouchableOpacity>
                    {/* Ao tocar na categoria abrir modal com todas as categorias para escolher uma */}
                    <Text style={{ fontSize: 18, color: '#fff', flex: 1, textAlign: 'center' }}>{categoryIndex != null ? categories[categoryIndex].name : '----'}</Text>
                    <TouchableOpacity disabled={categoryIndex === null || categoryIndex === categories.length - 1} style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }} onPress={() => chooseCategory('NEXT')}>
                        <Ionicons name="chevron-forward" size={24} color={categoryIndex === null || categoryIndex === categories.length - 1 ? "#000" : "#fff"} />
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