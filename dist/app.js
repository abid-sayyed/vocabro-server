import express from 'express';
import dotenv from 'dotenv';
//For env File
dotenv.config();
console.log('Current Environment of abid:', process.env.NODE_ENV);
const app = express();
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Welcome to Express & TypeScript Server');
});
app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
