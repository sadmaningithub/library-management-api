import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { BorrowBook } from "../models/borrow.model";

export const booksRoutes = express.Router();

booksRoutes.post('/books', async (req: Request, res: Response) => {
    const body = req.body;
    const book = await Book.create(body);
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book
    })
})

booksRoutes.post('/borrow', async (req: Request, res: Response) => {

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

booksRoutes.get('/books', async (req: Request, res: Response) => {

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

booksRoutes.get('/books/:bookId', async (req: Request, res: Response) => {
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

booksRoutes.get('/borrow', async (req: Request, res: Response) => {

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

booksRoutes.put('/books/:bookId', async (req: Request, res: Response) => {
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

booksRoutes.delete('/books/:bookId', async (req: Request, res: Response) => {
    const id = req.params.bookId;
    // console.log(id)
    const book = await Book.findByIdAndDelete(id);

    res.status(201).json({
        success: true,
        message: "Book deleted successfully",
        data: null
    })
})

