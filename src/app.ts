import express, { Application, Request, Response } from 'express';
import { model, Schema } from 'mongoose';
import { Book } from './app/models/book.model';
import { BorrowBook } from './app/models/borrow.model';
import { booksRoutes } from './app/controllers/books.controller';

const app: Application = express();

app.use(express.json());

app.use("/api", booksRoutes)

// const bookSchema = new Schema({
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     genre: {
//         type: String,
//         required: true,
//         enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']
//     },
//     isbn: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     description: String,
//     copies: {
//         type: Number,
//         required: true,
//         min: [0, 'Number of copies available cannot be negative.']
//     },
//     available: {
//         type: Boolean,
//         default: true
//     }
// },
//     {
//         versionKey: false,
//         timestamps: true
//     }
// );


//instance method to update book availability
// bookSchema.methods.updateAvailability = function () {
//     if (this.copies <= 0) {
//         this.available = false;
//     }
//     return this.save();
// };

// const Book = model('Book', bookSchema)

// const borrowBookSchema = new Schema({
//     book: {
//         type: Schema.Types.ObjectId,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         min: [1, 'Invalid quantity']
//     },
//     dueDate: {
//         type: Date,
//         required: true
//     }
// }, {
//     timestamps: true,
//     versionKey: false
// });

// const BorrowBook = model('BorrowBook', borrowBookSchema)



app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to library management api.')
})

export default app;