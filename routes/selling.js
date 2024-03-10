const express = require('express');
const axios = require('axios');
const router = express.Router();
const yahooFinance = require('yahoo-finance');

async function selling_StockData(symbol, strategy, startDate, endDate, action) {
  let bestSellPrice;
  let bestSellDate;

  switch(strategy){
    case 'Lowrisk':
      const lowrisk_res = await lowrisk(symbol, startDate, endDate);
      bestSellPrice = lowrisk_res.best_price;
      bestSellDate = lowrisk_res.best_time_to_sell;
      break;
    
    case 'Equity':
      const equity_res = await equity(symbol, startDate, endDate);
      bestSellPrice = equity_res.best_price;
      bestSellDate = equity_res.best_time_to_sell;
      break;

    case 'GlobalMacro':
      const globalMacro_res = await GlobalMacro(symbol, startDate, endDate);
      bestSellPrice = globalMacro_res.best_price;
      bestSellDate = globalMacro_res.best_time_to_sell;
      break;

    case 'JumpTrading':
      const jumptrading_res = await JumpTrading(symbol, startDate, endDate);
      bestSellPrice = jumptrading_res.best_price;
      bestSellDate = jumptrading_res.best_time_to_sell;
      break;
    
    default:
      const default_is_lowrisk = await lowrisk(symbol, startDate, endDate);
      strategy = 'default strategy is Lowrisk';
      bestSellPrice = default_is_lowrisk.best_price;
      bestSellDate = default_is_lowrisk.best_time_to_sell;
      break;
  }

    return {
      symbol: symbol,
      strategy: strategy,
      startDate: startDate,
      endDate: endDate,
      bestSellPrice: bestSellPrice,
      bestSellDate: bestSellDate
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

      // Find the day with the highest price
      let bestDay = historicalData[0];
      for (let i = 1; i < historicalData.length; i++) {
          if (historicalData[i].high < bestDay.high) {
              bestDay = historicalData[i];
          }
      }

      return {
          best_time_to_sell: bestDay.date,
          best_price: bestDay.close,
      };
  } catch (error) {
      console.error('Error finding the best time to sell:', error.message);
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
        best_time_to_sell: bestDay.date,
        best_price: bestDay.close,
      }

  } catch (error) {
      console.error('Error finding the best time to sell of equity:', error.message);
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

      bestDay = historicalData[0];
      for (let i = 1; i < historicalData.length; i++) {
          if (historicalData[i].open - historicalData[i].low > bestDay.open - bestDay.low) {
              bestDay = historicalData[i];
          }
      }

      return{
        best_time_to_sell: bestDay.date,
        best_price: bestDay.close,
      }

  } catch (error) {
      console.error('Error finding the best time to sell of GlobalMacro:', error.message);
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
          if (historicalData[i].adjClose > bestDay.adjClose && historicalData[i].volume < bestDay.volume) {
              bestDay = historicalData[i];
          }
      }

      return{
        best_time_to_sell: bestDay.date,
        best_price: bestDay.close,
      }

  } catch (error) {
      console.error('Error finding the best time to sell of JumpTrading:', error.message);
      throw error;
  }
}

module.exports = selling_StockData;