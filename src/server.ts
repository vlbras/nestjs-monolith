import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server started on 3000');
});
