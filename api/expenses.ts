import { Expense } from "entity"
import api from "./client"
import { ExpenseDTO } from "./DTOs/expenseDTO"

export const getExpenses = async () => {
    const expensesResp: { data: ExpenseDTO[] } = await api.get(`/users/expenses?format=MonthYearGroup`)
    return expensesResp.data
}

export const postExpense = async (expense: Expense) => {
    const expenseResp: { data: Expense } = await api.post(`/users/expenses`, expense)
    return expenseResp.data
}