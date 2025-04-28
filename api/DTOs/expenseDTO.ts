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