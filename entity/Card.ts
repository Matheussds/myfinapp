export type Card = {
    guid?: string | null;
    name: string;
    payment_method_id: number;
    closing_day?: number | null;
    due_day?: number | null;
    identification_color: string;
}