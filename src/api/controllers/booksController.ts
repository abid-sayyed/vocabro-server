import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { BASE_PATH } from '@config/pathConfig';
import multer from 'multer';
import Books from '@models/books';

const pdfBasePath = path.join(BASE_PATH, 'uploads', 'pdfs');

// Custom storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfBasePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFolder = multer({ storage });

/**
 * @desc Get all Books (Currently only one book is served)
 * @route GET /api/books
 * @access Public
 */
const getBooks = async (req: Request, res: Response) => {
  const books = await Books.findAll();
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
    if (err) {
      return next(err);
    }

    try {
      const requestData = JSON.parse(req.body.requestData);
      const title = requestData.title;
      const fileName = req.file?.originalname;
      const fileURL = req.file?.path;

      const newBook = await Books.create({ title, fileName, fileURL });

      return res.status(201).json({
        message: 'File uploaded and book created successfully',
        book: newBook,
      });
    } catch (dbError) {
      return next(dbError);
    }
  });
};

export { getBooks, postBook, getBookURL };
