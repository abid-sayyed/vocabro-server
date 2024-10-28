import express from 'express';

const router = express.Router();

router.get('/books', (req, res) => {
  res.status(200).json({ message: 'GET request to the homepage' });
});

router.post('/books', (req, res) => {
  res.status(200).json({ message: 'POST request to the homepage' });
});

router.put('/books', (req, res) => {
  res.status(200).json({ message: 'PUT request to the homepage' });
});

router.delete('/books', (req, res) => {
  res.status(200).json({ message: 'DELETE request to the homepage' });
});

export default router;
