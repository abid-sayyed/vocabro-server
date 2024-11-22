import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { BASE_PATH } from '@config/pathConfig';
import Book from '@database/models/book.model';
import { uploadFolder, createBookService } from '@api/services/book.service';

const pdfBasePath = path.join(BASE_PATH, 'uploads', 'pdfs');

/**
 * @desc Get all Books (Currently only one book is served)
 * @route GET /api/books
 * @access Public
 */
const getBooks = async (req: Request, res: Response) => {
  const books = await Book.findAll();
  res.status(200).json(books);
};

/**
 * @desc Get a Book URL (e.g., to download or view the book PDF)
 * @route GET /api/books/:bookURL
 * @access Public
 */
const getBookURL = async (req: Request, res: Response) => {
  const { bookURL } = req.params;
  const pdfFile = path.join(pdfBasePath, bookURL);
  res.sendFile(pdfFile);
};

/**
 * @desc  Upload a Book
 * @route  POST /api/books
 * @access Public  //have to make it private using authentication
 */
const postBook = async (req: Request, res: Response, next: NextFunction) => {
  uploadFolder.single('file')(req, res, async (err) => {
    if (!req.file || !req.body.requestData) {
      res.statusCode = 400;
      next(new Error('File and request data are required'));
      return;
    }

    if (err) {
      next(err);
      return;
    }

    const requestData = JSON.parse(req.body.requestData);
    const { statusCode, message, newBook } = await createBookService(
      requestData.title,
      req.file,
    );

    // If the book wasn't created successfully, pass error to Express error handler
    if (statusCode !== 201) {
      res.status(statusCode);
      next(new Error(message));
      return;
    }

    // Return success response
    res.status(201).json({
      message: 'File uploaded and book created successfully',
      book: newBook,
    });
  });
};

export { getBooks, postBook, getBookURL };
