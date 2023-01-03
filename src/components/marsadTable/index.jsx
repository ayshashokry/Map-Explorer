import React from "react";
import { useTranslation } from "react-i18next";

export default function MarsadTable(props) {
    const { t } = useTranslation("common");
    return (
        props.data ? <div>
            <table class="table table-hover result-table table-bordered" >
                <thead>
                    <th style={{ textAlign: 'center' }}>{t('indicator')}</th>
                    <th style={{ textAlign: 'center' }}>{t('color')}</th>
                    {props.data && props.data[Object.keys(props.data)[0]].govs.map((gov) => {
                        return (
                            <th style={{ textAlign: 'center' }}>
                                {gov.attributes.GOV_NAME}
                            </th>
                        )
                    })}
                    {props.data && props.data[Object.keys(props.data)[0]].govs.length == 1 &&
                        <th style={{ textAlign: 'center' }}> {t('indicatorUnit')} </th>
                    }
                </thead>
                <tbody>
                    {Object.keys(props.data).map((key, value) => {
                        return (<tr>
                            <td style={{ padding: '15px', textAlign: 'center' }}>{key}</td>
                            <td style={{ textAlign: 'center' }}>
                                <div style={{
                                    backgroundColor: props.data[key].color,
                                    margin: '5px',
                                    width: '20px', height: '20px',
                                    marginLeft: 'auto', marginRight: 'auto'
                                }}></div>
                            </td>
                            {props.data[key].govs.map((gov) => {
                                return (
                                    <td style={{ textAlign: 'center' }}>
                                        {gov.attributes.INDICATOR_VALUE}
                                    </td>
                                )
                            })}
                            {props.data[key].govs.length == 1 && props.data[key].govs.map((gov) => {
                                return (
                                    <td style={{ textAlign: 'center' }}>
                                        {gov.attributes.INDICATOR_MEASURE}
                                    </td>
                                )
                            })}
                        </tr>)
                    })}
                </tbody>
            </table>
        </div > : <></>)
}
