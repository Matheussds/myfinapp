export type Expense = {
    guid: string;
    description: string;
    value: number;
    spentAt: Date;
    categoryGuid: string;
    paymentMethodId: number;
    cardGuid?: string;
    isRecurring: boolean;
    installments?: number;
    installmentNumber?: number;
}