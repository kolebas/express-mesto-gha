const express = require('express');
const mongoose = require('mongoose');
const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mynewdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер localhost:${PORT}`);
});