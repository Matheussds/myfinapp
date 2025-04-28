import { Card } from "entity";
import api from "./client"

export const getCards = async () => {
    const cardsResp: {data: Card[]} = await api.get('/users/cards');
    return cardsResp.data;
}