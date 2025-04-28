import { User } from "entity";


export type UserCredentialsDTO = {
    token: string;
    refreshToken: string;
    user: User;
};