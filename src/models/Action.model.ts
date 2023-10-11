import { Schema, Types, model } from "mongoose";

import { IActionToken } from "../types";
import { EActionTokenType } from "../enums";
import { User } from "./User.model";

const tockensSchema = new Schema(
    {
        token: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: EActionTokenType,
            required: true,
        },
        _userId: {
            type: Types.ObjectId,
            required: true,
            ref: User
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export const ActionToken = model<IActionToken>('action-token', tockensSchema)