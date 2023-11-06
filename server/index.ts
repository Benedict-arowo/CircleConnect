import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const morgan = require('morgan');
const app: Express = express();
const port = process.env.PORT;

app.use('', morgan('dev'))

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});