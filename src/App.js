import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './Components/CurrencyRow';
import Axios from 'axios';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    const fetchItems = async () => {
      const result = await Axios(`https://api.exchangeratesapi.io/latest`);
      const firstCurrency = Object.keys(result.data.rates)[0];
      setCurrencyOptions([result.data.base, ...Object.keys(result.data.rates)]);
      setFromCurrency(result.data.base);
      setToCurrency(firstCurrency);
      setExchangeRate(result.data.rates[firstCurrency]);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      const fetchItems = async () => {
        const res = await Axios(
          `https://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`
        );
        setExchangeRate(res.data.rates[toCurrency]);
      };
      fetchItems();
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  };

  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  };

  return (
    <>
      <div className="card">
        <h1>Currency Converter</h1>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          amount={fromAmount}
          onChangeAmount={handleFromAmountChange}
        />
        <div className="equals">=</div>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          amount={toAmount}
          onChangeAmount={handleToAmountChange}
        />
      </div>
    </>
  );
}

export default App;
