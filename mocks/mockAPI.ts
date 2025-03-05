import expenseData from './expenseData.json';

let expenseDataJson = expenseData;

type DayList = {
    maxValue: number;
    date: string;
    values: {
        value: number;
        description: string;
    }[]
}

interface Value {
    value: number;
    description: string;
}

interface Day {
    date: string;
    maxValue: number;
    values: Value[];
}

type InstallmentsList = {
    value: number;
    currentInstallment: number;
    totalInstallments: number;
    description: string;
}

type ExpenseData = {
    categoryId: string;
    category: string;
    dates: {
        year: number;
        month: number;
        expenseList: DayList[];
        installments: InstallmentsList[];
    }[];
};

const getExpenses = async () => {
    return new Promise<ExpenseData[]>((resolve) => {
        setTimeout(() => {
            resolve(expenseDataJson);
        }, 1000); // simula um atraso de 1 segundo
    });
}

const postMoneyExpense = async (data: Value, year: number, month: number, categoryId: string) => {
    return new Promise<string>((resolve) => {
        setTimeout(() => {
            resolve("XXX-XXX-XXX");
        }, 1000); // simula um atraso de 1 segundo
    });
}

export { getExpenses, postMoneyExpense };
