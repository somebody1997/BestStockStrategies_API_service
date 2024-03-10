const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.port || 3000;
const buying_algorithm = require('./routes/buying.js');
const selling_algorithm = require('./routes/selling.js');

app.get('/', (req, res) =>{
    res.send('Best_Strategies main place !');
});

app.get('/test', (req, res) => {
    res.send('Test route is working');
});

app.get('/api/Best_Strategies/:strategy/:symbol/BUY/:startDate/:endDate', async (req, res) => {
    const { strategy, symbol, startDate, endDate } = req.params;
    try {
      const stockData = await buying_algorithm(symbol.toUpperCase(), strategy,startDate, endDate, 'buy');
      res.json({
        symbol: stockData.symbol,
        strategy: stockData.strategy,
        startDate: stockData.startDate,
        endDate: stockData.endDate,
        bestBuyPrice: stockData.bestBuyPrice,
        bestBuyDate: stockData.bestBuyDate
      });
    } catch (error) {
      res.status(500).send('Error fetching stock data for buying strategy');
    }
});
  
  
  // Endpoint for selling strategies
app.get('/api/Best_Strategies/:strategy/:symbol/SELL/:startDate/:endDate', async (req, res) => {
    const { strategy, symbol, startDate, endDate } = req.params;
    try {
      const stockData = await selling_algorithm(symbol.toUpperCase(), strategy,startDate, endDate, 'sell');
      res.json({
        symbol: stockData.symbol,
        strategy: stockData.strategy,
        startDate: stockData.startDate,
        endDate: stockData.endDate,
        bestSellPrice: stockData.bestSellPrice,
        bestSellDate: stockData.bestSellDate
      });
    } catch (error) {
      res.status(500).send('Error fetching stock data for buying strategy');
    }
});


app.listen(port, () => {
    console.log(`listen at port :${port}`);
});