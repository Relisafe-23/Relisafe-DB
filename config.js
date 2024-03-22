import dotenv from "dotenv";
dotenv.config({ silent: true });
const { PORT, NODE_ENVIROMMENT, DATABASE, SESSION_TOKEN } = process.env;

export const port = PORT;
export const TOKEN_KEY = SESSION_TOKEN;
