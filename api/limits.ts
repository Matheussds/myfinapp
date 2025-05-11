import { Limit } from "entity";
import api from "./client"

export const getLimits = async () => {
    const limitsResp: {data: Limit} = await api.get('/users/limits');
    return limitsResp.data;
}

export const postLimits = async (limits: Limit) => {
    const limitsResp: {data: Limit} = await api.post('/users/limits', limits);
    return limitsResp.data;
}
