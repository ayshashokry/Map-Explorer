import React from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function DataTable({ title, chartsData, hasArea }) {
  const { t } = useTranslation('print', 'dashboard');

  return (
    <div className="dashDataPage">
      <h4>
        {title === "MUNICIPALITY_NAME"
          ? t('dashboard:mainMunicipalities')
          : title === "SUB_MUNICIPALITY_NAME"
            ? t('dashboard:secMunicipalities')
            : title === 'PLAN_NO' ?
              t('dashboard:plans') : title === 'DISTRICT_NAME' ? t('dashboard:districts')
                : t('dashboard:sumForLayer')}
      </h4>
      <button
        className="printBtn mt-3 mx-4 py-2"
        size="large"
        htmlType="submit"

      >
        <FontAwesomeIcon
          icon={faPrint}
          className="mx-2"
          style={{ fontSize: "15px" }}
        />

        {t("print")}</button>
      <Table className="table  dashDataTable">
        <thead>

          {hasArea ? <th>{t('dashboard:totalArea')} </th> : null}
          <th>{t('dashboard:totalCount')}</th>
          <th>{t('dashboard:name')}</th>
        </thead>

        <tbody>
          {(typeof chartsData.count === 'object' && hasArea) ?
            chartsData.count.map((item, index) => (<tr key={"tbl" + index}>
              <td>{parseFloat(chartsData.areaOrLength.value[index]['AREA']).toFixed(2)}</td>
              <td>{(item['COUNT'])}</td>
              <td>{item[title] ? item[title] : t('dashboard:NotDefined')}</td>
            </tr>)




            )
            : (typeof chartsData.count === 'object' && !hasArea )?
            chartsData.count.map((item, index) => (<tr key={"tbl" + index}>
              <td>{(item['COUNT'])}</td>
              <td>{item[title] ? item[title] : t('dashboard:NotDefined')}</td>
             
            </tr>))
            :(typeof chartsData.count !== 'object' && hasArea)?
            <tr>
              <td>{parseFloat(chartsData.areaOrLength.value).toFixed(2)}</td>
              <td>{(chartsData.count)}</td>
              <td>{ t('dashboard:all')}</td>
            </tr>
: <tr>
<td>{(chartsData.count)}</td>
<td>{ t('dashboard:all')}</td>
</tr>}

        </tbody>
      </Table>
    </div>
  );
}
