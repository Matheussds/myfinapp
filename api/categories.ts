import { Category } from "entity"
import api from "./client"

export const getCategories = async () => {
    const categoriesResp: { data: Category[] } = await api.get(`/users/categories`)
    return categoriesResp.data
}

export const postCategory = async (category: Category) => {
    const categoryResp: { data: Category } = await api.post(`/users/categories`, category)
    return categoryResp.data
}