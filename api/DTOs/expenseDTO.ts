import { Expense } from "entity";

export type DayExpenses = {
    day: string;
    expenses: Expense[];
}

export type ExpensesMonthYear = {
    month_year: string;
    total_value: number;
    day_expenses: DayExpenses[];
    installments: Expense[];
}

export type ExpenseDTO = {
    category_guid: string;
    expenses_month_year: ExpensesMonthYear[];
}

export type ExpensePostDTO = {
    description: string;
    value: number;
    date: string; // ou Date, dependendo de como pretende lidar com datas
    payment_method_id: number;
    category_guid: string; // Assume-se uma string para GUID
    card_guid?: string | null;
    is_recurring: boolean;
    installments?: number | null;
}