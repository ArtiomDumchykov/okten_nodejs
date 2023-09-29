import { config } from "dotenv"

config();

export const configs = {
    PORT: process.env.PORT || 8080,
    mongo: {
        DB_URI: process.env.DB_URI || "mongodb://localhost:27017/okten"
    }
}