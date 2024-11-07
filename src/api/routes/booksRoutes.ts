import express from 'express';
import { getBooks, postBook, getBookURL } from '../controllers/booksController';

const router = express.Router();

//get all booksa
router.get('/books', getBooks);

//get book url
router.get('/book/:bookURL', getBookURL);

router.post('/books', postBook);

router.put('/books', (req, res) => {
  res.status(200).json({ message: 'PUT request to the homepage' });
});

router.delete('/books', (req, res) => {
  res.status(200).json({ message: 'DELETE request to the homepage' });
});

export default router;
