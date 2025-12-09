import express, { Application, Request, Response } from 'express';
import { model, Schema } from 'mongoose';

const app: Application = express();

app.use(express.json());

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
        type: String,
        required: true,
        enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY']
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    copies: {
        type: Number,
        required: true,
        min: [0, 'Number of copies available cannot be negative.']
    },
    available: {
        type: Boolean,
        default: true
    }
},
    {
        versionKey: false,
        timestamps: true
    }
);

const Book = model('Book', bookSchema)

const borrowBookSchema = new Schema({
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
});

const BorrowBook = model('BorrowBook', borrowBookSchema)

app.post('/api/books', async (req: Request, res: Response) => {
    const body = req.body;
    const book = await Book.create(body);
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        book
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


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to library management api.')
})

export default app;