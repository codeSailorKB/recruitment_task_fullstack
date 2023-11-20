import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import axios from 'axios';
import CurrenciesTable from "./ExchangeRates/CurrenciesTable.react";
import {formatDateObjToString} from "../utils/dates";
import FormDatePicker from "./Form/FormDatePicker.react";


export default () => {
    const ctrUrl = 'http://telemedi-zadanie.localhost/api/exchange-rates';
    const {date} = useParams();

    const [currencyDate, setCurrencyDate] = useState(new Date(date));
    const [loading, setLoading] = useState(true);
    const [currenciesData, setCurrenciesData] = useState([]);
    const formattedDate = formatDateObjToString(currencyDate);
    const pageTitle = `Telemedi - tabela kursów z dn. ${formattedDate}`;

    const getData = () => {
        axios.get(`${ctrUrl}/${formattedDate}`).then(response => {
            setLoading(false);
            setCurrenciesData(response.data);
        }).catch(function (error) {
            setLoading(false);
        });
    }

    useEffect(() => {
        setLoading(true);
        getData();
        window.history.replaceState(null, pageTitle, `/exchange-rates/${formattedDate}`)

    }, [currencyDate]);

    return (
        <section className="row-section">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-10">
                        <h2 className="text-center">
                            <span>Tablica kursów walut z dnia {formatDateObjToString(currencyDate)}</span>
                        </h2>
                        <div className="currency-date">
                            <span className="date-picker-label">Wybierz datę: </span>
                            <FormDatePicker
                                selected={currencyDate}
                                minDate={new Date("01-01-2023")}
                                maxDate={new Date()}
                                callback={setCurrencyDate}
                            />
                        </div>
                        {loading ? (
                            <div className={'text-center'}>
                                <span className="fa fa-spin fa-spinner fa-4x"></span>
                            </div>
                        ) : <CurrenciesTable data={currenciesData}/>
                        }
                    </div>
                </div>
            </div>
        </section>);
}
