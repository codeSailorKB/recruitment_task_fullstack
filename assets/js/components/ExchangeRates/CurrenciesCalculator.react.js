import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import '../../../css/components/CurrenciesTable.css';

import {roundNumber} from "../../utils/numbers";

const CurrenciesCalculator = ({data}) => {
    const [calculatorResult, setCalculatorResult] = useState(0);
    const [firstCurrency, setFirstCurrency] = useState(null);
    const [secondCurrency, setSecondCurrency] = useState(null);
    const [valueToRecount, setValueToRecount] = useState(0);
    const [error, setError] = useState(false);

    useEffect(() => {
        recalculateResult();

    }, [firstCurrency, secondCurrency, valueToRecount]);

    const recalculateResult = () => {
        setError(false);
        let firstValue = getCurrencyRate(firstCurrency, 'buy');
        let secondValue = getCurrencyRate(secondCurrency, 'sell');
        let result = firstValue * valueToRecount / secondValue;

        setCalculatorResult(roundNumber(result, 2));

        if (result == 0) {
            setError(true);
        }
    }

    const getCurrencyRate = (currencyCode, type) => {
        let currency = data.find(currency => currency.code === currencyCode);

        if (type === 'sell') {
            return isNaN(currency?.sellPrice) ? 0 : currency?.sellPrice;
        } else {
            return isNaN(currency?.buyPrice) ? 0 : currency?.buyPrice;
        }
    }

    const currencySelect =
        (currency, callbackFn) => {
            return <select onChange={e => callbackFn(e.target.value)} value={currency}>
                <option value=""></option>
                {
                    data.map(currency => {
                            return <option value={currency.code}>{currency.currency}</option>
                        }
                    )
                }
            </select>
        }

    return (
        <div className="currency-calculator">
            <h2>Przelicz walutę</h2>
            <table className="styled-table">
                <tbody>
                <tr>
                    <td>
                        {currencySelect(firstCurrency, setFirstCurrency)}
                    </td>
                    <td>
                        <input value={valueToRecount} onChange={e => setValueToRecount(e.target.value)}/>
                    </td>
                    <td>
                        {currencySelect(secondCurrency, setSecondCurrency)}
                    </td>
                    <td><span className="calculator-result"></span>Wynik: {calculatorResult} </td>
                </tr>
                </tbody>
            </table>
            {
                error &&
                <span className="error-exchanging">Nie można przeliczyc walut w wybranej konfiguracji.</span>

            }
        </div>)
        ;
}

export default CurrenciesCalculator;

CurrenciesCalculator.propTypes = {
    /**
     * Data to display
     */
    data: PropTypes.node,
};
