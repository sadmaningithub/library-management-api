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
});

const Book = model('Book', bookSchema)

app.post('/api/books', async(req: Request, res: Response) => {
    const body = req.body;
    const book = await Book.create(body);
    res.status(201).json({
            success: true,
            message: "Book created successfully",
            book
    })
})

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to library management api.')
})

export default app;