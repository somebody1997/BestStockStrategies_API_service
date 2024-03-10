const express = require('express');
const axios = require('axios');
const router = express.Router();
const yahooFinance = require('yahoo-finance');

async function buying_StockData(symbol, strategy, startDate, endDate, action) {
  let bestBuyPrice;
  let bestBuyDate;

  switch(strategy){
    case 'Lowrisk':
      //bestBuyDate = startDate;
      const lowrisk_res = await lowrisk(symbol, startDate, endDate);
      bestBuyPrice = lowrisk_res.best_price;
      bestBuyDate = lowrisk_res.best_time_to_buy;
      break;
    
    case 'Equity':
      const equity_res = await equity(symbol, startDate, endDate);
      bestBuyPrice = equity_res.best_price;
      bestBuyDate = equity_res.best_time_to_buy;
      break;

    case 'GlobalMacro':
      const globalMacro_res = await GlobalMacro(symbol, startDate, endDate);
      bestBuyPrice = globalMacro_res.best_price;
      bestBuyDate = globalMacro_res.best_time_to_buy;
      break;

    case 'JumpTrading':
      const jumptrading_res = await JumpTrading(symbol, startDate, endDate);
      bestBuyPrice = jumptrading_res.best_price;
      bestBuyDate = jumptrading_res.best_time_to_buy;
      break;
    
    default:
      const default_is_lowrisk = await lowrisk(symbol, startDate, endDate);
      strategy = 'default strategy is Lowrisk';
      bestBuyPrice = default_is_lowrisk.best_price;
      bestBuyDate = default_is_lowrisk.best_time_to_buy;
      break;
  }

    return {
      symbol: symbol,
      strategy: strategy,
      startDate: startDate,
      endDate: endDate,
      bestBuyPrice: bestBuyPrice,
      bestBuyDate: bestBuyDate
    };
}  

async function lowrisk(symbol, startDate, endDate) {
  try {
      // Fetch historical data for the stock
      const historicalData = await yahooFinance.historical({
          symbol: symbol,
          from: startDate,
          to: endDate,
          // Ensure we get data for each day in the range
          period: 'd',
      });

      if (!historicalData.length) {
          throw new Error('No data found for the given period.');
      }

      // Find the day with the lowest closing price
      let bestDay = historicalData[0];
      for (let i = 1; i < historicalData.length; i++) {
          if (historicalData[i].close < bestDay.close) {
              bestDay = historicalData[i];
          }
      }

      return {
          best_time_to_buy: bestDay.date,
          best_price: bestDay.close,
      };
  } catch (error) {
      console.error('Error finding the best time to buy:', error.message);
      throw error;
  }
}

async function equity(symbol, startDate, endDate) {
  let historicalData;
  let bestDay;
  try {
        historicalData = await yahooFinance.historical({
          symbol: symbol,
          from: startDate,
          to: endDate,
          period: 'd',
        });

      if (!historicalData.length) {
        throw new Error('No data found for the given period.');
      }

      // Find the day with the highest range of price
      bestDay = historicalData[0];
      let open_total;
      for (let i = 1; i < historicalData.length; i++) {
          open_total = open_total += historicalData[i];
      }
      open_total / (startDate - endDate) + 1;
      for (let i = 1; i < historicalData.length; i++) {
        if( Math.abs(historicalData[i].open - open_total) < Math.abs(bestDay.open - open_total)){
          bestDay = historicalData[i];
        }
     }

      return{
        best_time_to_buy: bestDay.date,
        best_price: bestDay.close,
      }

  } catch (error) {
      console.error('Error finding the best time to buy of equity:', error.message);
      throw error;
  }
}

async function GlobalMacro(symbol, startDate, endDate) {
  let historicalData;
  let bestDay;
  try {
        historicalData = await yahooFinance.historical({
          symbol: symbol,
          from: startDate,
          to: endDate,
          period: 'd',
        });

      if (!historicalData.length) {
        throw new Error('No data found for the given period.');
      }

      // Find the day with the highest range of price
      bestDay = historicalData[0];
      for (let i = 1; i < historicalData.length; i++) {
          if (historicalData[i].high - historicalData[i].low > bestDay.high - bestDay.low) {
              bestDay = historicalData[i];
          }
      }

      return{
        best_time_to_buy: bestDay.date,
        best_price: bestDay.close,
      }

  } catch (error) {
      console.error('Error finding the best time to buy of equity:', error.message);
      throw error;
  }
}

async function JumpTrading(symbol, startDate, endDate) {
  let historicalData;
  let bestDay;
  try {
        historicalData = await yahooFinance.historical({
          symbol: symbol,
          from: startDate,
          to: endDate,
          period: 'd',
        });

      if (!historicalData.length) {
        throw new Error('No data found for the given period.');
      }

      bestDay = historicalData[0];
      for (let i = 1; i < historicalData.length; i++) {
          if (historicalData[i].adjClose < bestDay.adjClose && historicalData[i].volume < bestDay.volume) {
              bestDay = historicalData[i];
          }
      }

      return{
        best_time_to_buy: bestDay.date,
        best_price: bestDay.close,
      }

  } catch (error) {
      console.error('Error finding the best time to buy of equity:', error.message);
      throw error;
  }
}

module.exports = buying_StockData;