import express from 'express';
import { getBooks, postBook, getBookURL } from '../controllers/book.Controller';

const router = express.Router();

router.get('/books', getBooks);

router.get('/book/:bookURL', getBookURL);

router.post('/books', postBook);

router.put('/books', (req, res) => {
  res.status(200).json({ message: 'PUT request to the homepage' });
});

router.delete('/books', (req, res) => {
  res.status(200).json({ message: 'DELETE request to the homepage' });
});

export default router;
