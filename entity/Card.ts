export type Card = {
    guid: string;
    name: string;
    paymentMethodId: number;
    closingDay?: number;
    dueDay?: number;
}