export type Expense = {
    guid: string;
    description: string;
    value: number;
    spentAt: Date;
    category_guid: string;
    payment_method_id: number;
    card_guid?: string | null;
    is_recurring: boolean;
    installments?: number;
    installment_number?: number;
}