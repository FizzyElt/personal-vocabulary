import express from 'express';
import words from './routes';
const PORT = 4000;

const app = express();

app.use(express.json());

app.use('/words', words);

app.listen(PORT, () => {
  console.log(`listen port ${PORT}`);
});
