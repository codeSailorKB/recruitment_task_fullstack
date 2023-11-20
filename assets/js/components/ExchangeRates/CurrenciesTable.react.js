import React from 'react';
import PropTypes from 'prop-types';

import '../../../css/components/CurrenciesTable.css';

import {roundNumber} from "../../utils/numbers";
import {formatDateObjToString} from "../../utils/dates";

const CurrenciesTable = ({data}) => {
    return (
        <div className="currency-table">
            <table className="styled-table">
                <thead>
                <tr>
                    <th colSpan="3" className="header-no-background"></th>
                    <th colSpan="3" className="divider-cell">Dziś ({formatDateObjToString(new Date())})</th>
                    <th colSpan="3">Wybrana data</th>
                </tr>
                <tr>
                    <th>L.p.</th>
                    <th>Nazwa</th>
                    <th className="divider-cell">Kod waluty</th>
                    <th>Kurs średni NBP</th>
                    <th>Kupno</th>
                    <th className="divider-cell">Sprzedaż</th>
                    <th>Kurs średni NBP</th>
                    <th>Kupno</th>
                    <th>Sprzedaż</th>
                </tr>
                </thead>
                <tbody>
                {data?.length > 0 ? (data.map((record, key) => {
                        return <tr key={key}>
                            <td>{key + 1}</td>
                            <td>{record.currency}</td>
                            <td className="divider-cell">{record.code}</td>
                            <td>{record.midNow}</td>
                            <td>{roundNumber(record.buyPriceNow, 4)}</td>
                            <td className="divider-cell">{roundNumber(record.sellPriceNow, 4)}</td>
                            <td>{record.mid}</td>
                            <td>{roundNumber(record.buyPrice, 4)}</td>
                            <td>{roundNumber(record.sellPrice, 4)}</td>
                        </tr>
                    })) :
                    <tr>
                        <td colSpan="9">Brak wyników</td>
                    </tr>
                }
                </tbody>
            </table>
        </div>);
}

export default CurrenciesTable;

CurrenciesTable.propTypes = {
    /**
     * Data to display
     */
    data: PropTypes.node,
};
