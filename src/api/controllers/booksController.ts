import { Request, Response } from 'express';

//@desc Get all Books
//@route GET /api/books
//@access Public  //have to make it private using authetication
const getBooks = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, msg: 'Show all books' });
};

export { getBooks };
