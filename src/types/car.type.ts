import { Document } from "mongoose";

export interface ICar extends Document {
  year?: number;
  model?: string;
  manufacture?: string;
  price?: number;
}
