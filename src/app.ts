import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';

//For env File
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// console.log('Current Environment of abid:', process.env.NODE_ENV);
// console.log('Current Environment of PORT:', process.env.PORT)
// console.log('Current Environment All :', process.env);

const app: Application = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
