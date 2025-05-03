import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ButtonCircle from "@ui/ButtonCircle";
import ModalCategory from "@ui/modals/ModalCategory";
import { getCategories } from "@api";
import { Category } from "entity";
import * as SecureStore from 'expo-secure-store';

interface Props {
    onSelectCategory: (categoryGUID: string) => void;
}

export default function HeaderContext({ onSelectCategory }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySelected, setCategorySelected] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
    const [openModalCategory, setOpenModalCategory] = useState(false);

    const handleAddedCategory = async (category: Category) => {
        setCategories([...categories, category]);
        setCategorySelected(category);
        await SecureStore.setItemAsync('selectedCategory', JSON.stringify(category));
        setOpenModalCategory(false);
    }

    const loadCategories = async () => {
        setCategoryIndex(null);
        try {
            setIsLoading(true);
            const storedCategory = await SecureStore.getItemAsync('selectedCategory');
            const storedCategoryParse : Category | null = JSON.parse(storedCategory || 'null');
            storedCategoryParse && setCategorySelected(storedCategoryParse);
            const categories = await getCategories();
            setCategories(categories);
            const selectedCategoryIndex = categories.findIndex((cat) => cat.guid === storedCategoryParse?.guid);
            setCategoryIndex(selectedCategoryIndex >= 0 ? selectedCategoryIndex : categories.length > 0 ? 0 : null);
            if (!storedCategory && categories.length > 0) {
                categories[0].guid && onSelectCategory(categories[0].guid);
            } else if (storedCategory && selectedCategoryIndex >= 0) {
                storedCategoryParse?.guid && onSelectCategory(storedCategoryParse.guid);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            Alert.alert("Error", "Failed to load categories. Please try again.");
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
        console.log('HeaderContext mounted');
        
        loadCategories();
    }, []);

    useEffect(() => {
        const categoryIndex = categories.findIndex((cat) => cat.guid === categorySelected?.guid)
        console.log('categoryIndex', categoryIndex);
        console.log(categories);
        if (categoryIndex >= 0) {
            setCategoryIndex(categoryIndex);
            if (categorySelected && categorySelected.guid) {
                onSelectCategory(categorySelected.guid);
            }
        }
    }, [categorySelected]);

    return (
        <>
            <View style={styles.cardHeader}>
                <ButtonCircle backgroundColor='#000' onPressAdd={() => setOpenModalCategory(true)} />
                <View style={{ flex: 1, flexDirection: 'row', height: 70, alignItems: "center", justifyContent: 'center', backgroundColor: '#000', borderTopStartRadius: 50, borderBottomStartRadius: 50 }}>
                    {isLoading
                        ?
                        <ActivityIndicator size="large" color="#fff" />
                        :
                        <>

                            <TouchableOpacity disabled={categoryIndex === null || categoryIndex === 0} style={[{ flex: 1, alignItems: 'flex-start', paddingStart: 20 }]} onPress={() => chooseCategory('PREVIOUS')}>
                                <Ionicons name="chevron-back" size={24} color={categoryIndex === null || categoryIndex === 0 ? "#000" : "#fff"} />
                            </TouchableOpacity>
                            {/* Ao tocar na categoria abrir modal com todas as categorias para escolher uma */}
                            <Text style={{ fontSize: 18, color: '#fff', flex: 1, textAlign: 'center' }}>{categoryIndex != null ? categories[categoryIndex].name : '----'}</Text>
                            <TouchableOpacity disabled={categoryIndex === null || categoryIndex === categories.length - 1} style={{ flex: 1, alignItems: 'flex-end', paddingEnd: 20 }} onPress={() => chooseCategory('NEXT')}>
                                <Ionicons name="chevron-forward" size={24} color={categoryIndex === null || categoryIndex === categories.length - 1 ? "#000" : "#fff"} />
                            </TouchableOpacity>
                        </>}
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