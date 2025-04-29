export type Card = {
    guid: string;
    name: string;
    payment_method_id: number;
    closing_day?: number;
    due_day?: number;
}