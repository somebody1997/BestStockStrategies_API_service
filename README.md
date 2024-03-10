# BestStockStrategies_API_service
# Microservice for Stock Strategy Recommendations

This microservice provides stock buying and selling recommendations based on selected strategies. It allows users to query for the best times to buy or sell a specific stock symbol within a given date range.

## How to Request Data

To request data from the microservice, make a GET request to the appropriate endpoint. The request URL follows this format:


```
GET /api/Best_Strategies/:strategy/:symbol/:action/:startDate/:endDate
```
### Parameters:

- `:strategy` - The trading strategy to use (e.g., `Lowrisk`, `Equity`, `GlobalMacro`, `JumpTrading`). Any type error of strategy, will be response as Lowrisk strategy 
- `:symbol` - The stock symbol to query (e.g., `AAPL`).
- `:action` - The action, either `BUY` or `SELL`.
- `:startDate` - The start date of the period to analyze (YYYY-MM-DD).
- `:endDate` - The end date of the period to analyze (YYYY-MM-DD).

Currently the service is on 
```
https://best-stock-strategies-api-service.vercel.app
```
so the usage could be like below
```
https://best-stock-strategies-api-service.vercel.app/api/Best_Strategies/Lowrisk/AAPL/BUY/2022-01-01/2022-02-02
```

```
https://best-stock-strategies-api-service.vercel.app/api/Best_Strategies/GlobalMacro/AAPL/SELL/2022-10-11/2022-12-12
```
test use case 
Request:
```
https://best-stock-strategies-api-service.vercel.app/test
```
Response:
```
Test route is working
```


### Example call to request when to buy AAPL stock using a conservative strategy:


## How to Receive Data

The microservice responds with a JSON object containing the recommendation. For a buy request, the response will look like this:

```json
{
    "symbol": "AAPL",
    "strategy": "Lowrisk",
    "startDate": "2022-01-01",
    "endDate": "2022-02-02",
    "bestSellPrice": 161.619995,
    "bestSellDate": "2022-01-24T05:00:00.000Z"
}
```
For a sell request, the structure would be similar, indicating the best sell price and date.

