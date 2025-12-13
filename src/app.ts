import express, { Application, Request, Response } from 'express';
import { model, Schema } from 'mongoose';
import { Book } from './app/models/book.model';
import { BorrowBook } from './app/models/borrow.model';

const app: Application = express();

app.use(express.json());

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

app.post('/api/books', async (req: Request, res: Response) => {
    const body = req.body;
    const book = await Book.create(body);
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book
    })
})

app.post('/api/borrow', async (req: Request, res: Response) => {

    const doc = req.body;
    // console.log(typeof doc)
    const { book, quantity } = doc;
    // console.log(book, quantity)

    const bookInfo = await Book.findById(book)

    if (bookInfo === null) return console.log("Invalid")

    console.log(bookInfo?.copies)

    if (bookInfo.copies >= quantity) {

        console.log("Alright.")

        bookInfo.copies = bookInfo.copies - quantity;

        await bookInfo.save();
    }
    else {
        console.log("Sorry! not enough copies.")
    }

    await bookInfo.updateAvailability();

    const bookReq = await BorrowBook.create(doc);

    res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: bookReq
    })

})

app.get('/api/books', async (req: Request, res: Response) => {

    const filter = req.query.filter;
    const sortBy = req.query.sortBy;
    const sort = req.query.sort;
    const order = sort === 'asc' ? 1 : -1;
    const limit = req.query.limit || 10;

    // console.log({sortBy, order})
    // const order

    let query: any = {}

    // console.log(filter);

    if (filter) {
        query.genre = filter
    }

    const books = await Book.find(query).sort({ [sortBy]: order }).limit(limit);

    res.status(201).json({
        success: true,
        message: "Books retrieved successfully",
        data: books
    })
})

app.get('/api/books/:bookId', async (req: Request, res: Response) => {
    const id = req.params.bookId
    // console.log(id)
    const book = await Book.findById(id);
    // console.log(book)
    res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book
    })
})

app.get('/api/borrow', async (req: Request, res: Response) => {

    // const borrowData = await BorrowBook.find();

    const borrowData = await BorrowBook.aggregate([
        { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
        { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
        { $unwind: "$book" },
        { $project: { _id: 0, book: { title: "$book.title", isbn: "$book.isbn" }, totalQuantity: 1 } }
    ])

    res.status(200).json({
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: borrowData
    })
})


//update book

app.put('/api/books/:bookId', async (req: Request, res: Response) => {
    const id = req.params.bookId;
    const updatedDoc = req.body;
    // console.log(id, updatedDoc)
    // console.log(id)
    // console.log(updatedDoc)
    const updateBook = await Book.findByIdAndUpdate(id, updatedDoc, { new: true })
    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data: updateBook
    })
})

//delete book

app.delete('/api/books/:bookId', async (req: Request, res: Response) => {
    const id = req.params.bookId;
    // console.log(id)
    const book = await Book.findByIdAndDelete(id);

    res.status(201).json({
        success: true,
        message: "Book deleted successfully",
        data: null
    })
})

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to library management api.')
})

export default app;