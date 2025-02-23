const express = require('express');
const Book = require('../models/Book');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//Get all books
router.get('/', authMiddleware, async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Get book by id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Create a new book
router.post('/',  authMiddleware, async (req, res) => {
    try {
        const { title, description, coverImage, author, genre } = req.body;
        if(!title || !description || !coverImage || !author || !genre){
            return res.status(400).json({ message: 'All fields are required' });
        }
        const book = new Book({ title, description, coverImage, author, genre });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Update a book
router.put('/:id',  async (req, res) => {
    try {
        const { title, description, coverImage, author, genre } = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        book.title = title;
        book.description = description;
        book.coverImage = coverImage;
        book.author = author;
        book.genre = genre;
        await book.save();
        res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Delete a book
router.delete('/:id',  authMiddleware, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        await book.deleteOne();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//Create multiple books
router.post('/bulk', authMiddleware, async (req, res) => {
    try {
        const booksData = req.body; // Expecting an array of books in the request body
        
        // Check if booksData is an array and not empty
        if (!Array.isArray(booksData) || booksData.length === 0) {
            return res.status(400).json({ message: 'Input must be an array of books' });
        }
        
        // Loop through the array and create each book
        const books = [];
        for (const bookData of booksData) {
            const { title, description, coverImage, author, genre } = bookData;
            if (!title || !description || !coverImage || !author || !genre) {
                return res.status(400).json({ message: 'All fields are required for each book' });
            }
            const book = new Book({ title, description, coverImage, author, genre });
            await book.save();
            books.push(book);
        }

        // Return the array of created books
        res.status(201).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;