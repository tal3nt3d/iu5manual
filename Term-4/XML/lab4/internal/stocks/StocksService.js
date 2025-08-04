const {StocksDAO} = require('./StocksDAO');

class StocksService {
    static findStocks(id) {
        if (id !== undefined) {
            return StocksDAO.findById(id).toJSON();
        }

        return StocksDAO.find().map((stock) => stock.toJSON());
    }

    static addStock(stock) {
        return StocksDAO.insert(stock).toJSON();
    }

    static deleteStock(id) {
        return StocksDAO.delete(id).map((stock) => stock.toJSON());
    }
}

module.exports = {
    StocksService,
}