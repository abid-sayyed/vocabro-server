import { Request, Response } from 'express';
import path from 'path';
import { BASE_PATH } from '@config/pathConfig';
import multer from 'multer';

const pdfBasePath = path.join(BASE_PATH, 'uploads', 'pdfs');
console.log('pdfBasePathres:', pdfBasePath);

// Custom storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfBasePath); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp
    cb(null, Date.now() + path.extname(file.originalname)); // Append original file extension
  },
});

const uploadFolder = multer({ storage });

//@desc Get all Books  // for now only one book is served
//@route GET /api/books
//@access Public  //have to make it private using authetication
const getBooks = async (req: Request, res: Response) => {
  const pdfFile = path.join(pdfBasePath, 'abid_resume.pdf');
  res.sendFile(pdfFile);
};

//@desc Upload a Book
//@route POST /api/books
//@access Public  //have to make it private using authetication
const postBook = async (req: Request, res: Response) => {
  uploadFolder.single('file')(req, res, (err) => {
    const { title } = req.body;
    console.info('title:', title);
    if (err) {
      return res
        .status(400)
        .json({ message: 'Failed to upload file', error: err });
    }
    return res.status(200).json({ message: 'File uploaded successfully' });
  });
};

export { getBooks, postBook };
