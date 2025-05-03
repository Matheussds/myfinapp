//TODO Implementar o tanstack query para o gerenciamento de estado global
//TODO Implementar o react query para o gerenciamento de estado global
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Category } from '@entity';
import api from '@api/client';

interface CategoryContextType {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    categorySelected: Category | null;
    saveSelectedCategory: (category: Category) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySelected, setCategorySelected] = useState<Category | null>(null);

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
            if (response.status === 200) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setCategorySelected(response.data[0]);
                }
            } else {
                console.error('Failed to load categories:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadSelectedCategory = async () => {
        try {
            const selectedCategory = await SecureStore.getItemAsync('selectedCategory');
            if (selectedCategory) {
                setCategorySelected(JSON.parse(selectedCategory));
            }
        } catch (error) {
            console.error('Error loading selected category:', error);
        }
    }

    const saveSelectedCategory = async (category: Category) => {
        try {
            await SecureStore.setItemAsync('selectedCategory', JSON.stringify(category));
        } catch (error) {
            console.error('Error saving selected category:', error);
        }
    }

    useEffect(() => {
        loadCategories();
        loadSelectedCategory();
    }, []);

    return (
        <CategoryContext.Provider value={{ categories, setCategories, categorySelected, saveSelectedCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
}