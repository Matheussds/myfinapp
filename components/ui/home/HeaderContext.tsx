import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ButtonCircle from "@ui/ButtonCircle";
import ModalCategory from "@ui/modals/ModalCategory";
import { Category } from "entity";
import * as SecureStore from 'expo-secure-store';
import { GENERAL_CATEGORY_GUID } from "@utils/constants";
import { colors, spacing, borderRadius, shadows } from "../../../utils/designSystem";

interface Props {
    onSelectCategory: (categoryGUID: string) => void;
    categories: Category[];
    selectedCategoryGUID: string | null;
    isLoading: boolean;
}

export default function HeaderContext({ 
    onSelectCategory, 
    categories, 
    selectedCategoryGUID,
    isLoading 
}: Props) {
    const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
    const [openModalCategory, setOpenModalCategory] = useState(false);

    const handleAddedCategory = async (category: Category) => {
        console.log('handleAddedCategory chamado com:', category);
        setOpenModalCategory(false);
        // A nova categoria será adicionada pelo componente pai
    }

    const chooseCategory = async (position: 'PREVIOUS' | 'NEXT') => {
        console.log('=== chooseCategory INICIADO ===');
        console.log('Posição:', position);
        console.log('Índice atual:', categoryIndex);
        console.log('Total de categorias:', categories.length);
        
        if (categoryIndex !== null) {
            if (position === 'PREVIOUS' && categoryIndex === 0) {
                console.log('Já está na primeira categoria');
                return;
            }
            if (position === 'NEXT' && categoryIndex === categories.length - 1) {
                console.log('Já está na última categoria');
                return;
            }

            const newIndex = position === 'PREVIOUS' ? categoryIndex - 1 : categoryIndex + 1;
            const category = categories[newIndex];
            
            console.log('Nova categoria selecionada:', category);
            
            if (category && category.guid) {
                setCategoryIndex(newIndex);
                console.log('Chamando onSelectCategory com:', category.guid);
                onSelectCategory(category.guid);
                await SecureStore.setItemAsync('selectedCategory', JSON.stringify(category));
                console.log('Categoria salva no storage');
            }
        }
        console.log('=== chooseCategory FINALIZADO ===');
    }

    // Atualiza o índice da categoria quando selectedCategoryGUID muda
    useEffect(() => {
        console.log('=== HeaderContext useEffect selectedCategoryGUID ===');
        console.log('selectedCategoryGUID:', selectedCategoryGUID);
        console.log('Categorias disponíveis:', categories.map(c => ({ guid: c.guid, name: c.name })));
        
        if (selectedCategoryGUID && categories.length > 0) {
            const index = categories.findIndex(cat => cat.guid === selectedCategoryGUID);
            console.log('Índice encontrado:', index);
            setCategoryIndex(index >= 0 ? index : 0);
        }
        console.log('=== HeaderContext useEffect FINALIZADO ===');
    }, [selectedCategoryGUID, categories]);

    return (
        <>
            <View style={styles.cardHeader}>
                <ButtonCircle backgroundColor={colors.neutral[900]} onPressAdd={() => setOpenModalCategory(true)} />
                <View style={styles.categoryContainer}>
                    {isLoading
                        ?
                        <ActivityIndicator size="large" color={colors.text.inverse} />
                        :
                        <>
                            <TouchableOpacity 
                                disabled={categoryIndex === null || categoryIndex === 0} 
                                style={styles.navigationButton} 
                                onPress={() => chooseCategory('PREVIOUS')}
                            >
                                <Ionicons 
                                    name="chevron-back" 
                                    size={24} 
                                    color={categoryIndex === null || categoryIndex === 0 ? colors.neutral[400] : colors.text.inverse} 
                                />
                            </TouchableOpacity>
                            <Text style={styles.categoryText}>
                                {categoryIndex != null ? categories[categoryIndex].name : '----'}
                            </Text>
                            <TouchableOpacity 
                                disabled={categoryIndex === null || categoryIndex === categories.length - 1} 
                                style={styles.navigationButton} 
                                onPress={() => chooseCategory('NEXT')}
                            >
                                <Ionicons 
                                    name="chevron-forward" 
                                    size={24} 
                                    color={categoryIndex === null || categoryIndex === categories.length - 1 ? colors.neutral[400] : colors.text.inverse} 
                                />
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </View>
            <ModalCategory modalVisible={openModalCategory} onSetVisible={setOpenModalCategory} onAddCategory={handleAddedCategory} />
        </>
    )
}

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        gap: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.md,
    },
    categoryContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 70,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: colors.neutral[900],
        borderTopLeftRadius: borderRadius.xl,
        borderBottomLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        ...shadows.sm,
    },
    navigationButton: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    categoryText: {
        fontSize: 14, 
        color: colors.text.inverse, 
        flex: 1, 
        textAlign: 'center',
        fontWeight: '500',
    }
})