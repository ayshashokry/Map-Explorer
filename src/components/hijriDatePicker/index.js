import React, { Component } from 'react';
import HijriDatePicker from './components/HijriDatePicker'

class hijriDatePickerComp extends Component {
    render() {
        const { className, input, label, placeholder, style, t} = this.props;
        return (
            <HijriDatePicker disableOnClickOutside {...{ className, input }} placeholder={t(placeholder ? placeholder : label)} {...{ style }} />
        );
    }
}

export default hijriDatePickerComp;
