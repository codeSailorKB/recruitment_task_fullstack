import React from 'react';

import DatePicker, { registerLocale } from "react-datepicker";
import PropTypes from 'prop-types';
import pl from 'date-fns/locale/pl';

import "react-datepicker/dist/react-datepicker.css";
registerLocale('pl', pl)

const FormDatePicker =  ({selected, minDate, maxDate, callback}) => {
    return (
        <DatePicker
            selected={selected}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(date) => callback(date)}
            locale="pl"
        />);
}

export default FormDatePicker;

FormDatePicker.propTypes = {
    /**
     * Selected date
     */
    selected: PropTypes.valueAsDate,
    /**
     * Minimum available date
     */
    minDate: PropTypes.valueAsDate,
    /**
     * Max available date
     */
    maxDate: PropTypes.valueAsDate,
    /**
     * Callback method for on change
     */
    callback: PropTypes.func,
};

