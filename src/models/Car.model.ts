
import { Schema, model } from "mongoose";

const carSchema = new Schema(
    {
        year: {
            type: Number,
            min: [1970, "Minimum year is 1970"],
            max: [2023, "Maximum year is 2023"],
        },
        model: {
            type: String,
            required: true,
        },
        manufacture: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            min: [0, "Minimum price is 0"],
            max: [100_000_000, "Maximum price is 100_000_000"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)
export const Car = model("car", carSchema)