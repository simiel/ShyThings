const { compiledContract } = require('./compile');
const express = require('express');
const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000',
};

const app = express();
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(compiledContract));
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
