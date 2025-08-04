const {StocksService} = require('./internal/stocks/StocksService');
const {StocksRepository} = require('./internal/stocks/StocksRepository');
const {StocksDAO} = require('./internal/stocks/StocksDAO');
const {StocksController} = require('./internal/stocks/StocksController');

const express = require('express');
const cors = require('cors');

const stocks = require('./internal/stocks');

const app = express();

const host = 'localhost';
const port = 8000;

app.use(cors());

app.use(express.json());

app.use('/stocks', stocks);

app.listen(port, host, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});