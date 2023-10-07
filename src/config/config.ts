import { config } from "dotenv"

config();

export const configs = {
    PORT: process.env.PORT || 8080,
    mongo: {
        DB_URI: process.env.DB_URI || "mongodb://localhost:27017/okten",
    },
    jwt: {
        SECRET_SALT: process.env.SECRET_SALT || 10,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "accsess_secret_key",
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh_secret_key",
    },
}