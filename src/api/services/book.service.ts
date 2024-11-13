import path from 'path';
import { BASE_PATH } from '@config/pathConfig';
import multer from 'multer';
import Book from '@root/src/database/models/book.model';

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

// Book creation service
const createBookService = async (title: string, file?: Express.Multer.File) => {
  const fileName = file?.originalname ?? 'default-filename';
  const fileURL = file?.path ?? 'default-path';
  const newBook = await Book.create({ title, fileName, fileURL });

  return {
    statusCode: 201,
    message: 'Book created successfully',
    newBook,
  };
};

export { uploadFolder, createBookService };
