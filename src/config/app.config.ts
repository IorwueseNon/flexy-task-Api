import { getEnv } from "../util/env_helper";
import * as dotenv from "dotenv";
dotenv.config();

const appConfig = () =>({
    PORT: getEnv("PORT", "3000"),
    NODE_ENV: getEnv("NODE_ENV", "development"),
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URL: getEnv("MONGO_URL",""),

    SESSION_EXPIRE_IN: getEnv("SESSION_EXPIRE_IN", "1d"),
    SESSION_SECRET: getEnv("SESSION_SECRET", "default_secret"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID", ""),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET", ""),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"," "),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL", "localhost"),
    FRONTEND_BASE_PATH: getEnv("FRONTEND_BASE_PATH", "/"),
})

export const config = appConfig();


