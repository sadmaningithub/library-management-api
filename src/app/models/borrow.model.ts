import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowBookSchema = new Schema<IBorrow>({
    book: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Invalid quantity']
    },
    dueDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export const BorrowBook = model<IBorrow>('BorrowBook', borrowBookSchema)