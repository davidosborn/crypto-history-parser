# Crypto History Parser

A tool to parse the history of the cryptocurrency market.

## Input formats

The historical data from investing.com can be downloaded in CSV format and parsed by this software.
For example, [this page](https://ca.investing.com/crypto/bitcoin/btc-usd-historical-data) provides BTC/USD history.

Additional formats can be supported by adding an entry to ```NormalizeStream._converters```.

## Output format

The output is an array of historical samples, ordered by time, and formatted as JSON.

Each historical sample may contain the following fields:

| Field        | Type   | Semantics      | Description                                     |
| ------------ | ------ | -------------- | ----------------------------------------------- |
| ```time```   | Number | UNIX timestamp | The opening time of the trading period.         |
| ```open```   | Number | Currency       | The price at the opening of the trading period. |
| ```close```  | Number | Currency       | The price at the closing of the trading period. |
| ```high```   | Number | Currency       | The highest price during the trading period.    |
| ```low```    | Number | Currency       | The lowest price during the trading period.     |
| ```volume``` | Number | Currency       | The volume during the trading period.           |
| ```change``` | Number | Percent        | The change in price during the trading period.  |
