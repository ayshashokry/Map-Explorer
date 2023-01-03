import React, { useEffect } from "react";
import { useState } from "react";
import SideTable from "./SideTable";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

function SideTbls(props) {
  const { t } = useTranslation("dashboard");
  const [data, setData] = useState({});
  const dataPropsMemo = useMemo(()=>({
    data:props.data.data 
  }),[props.data.data ])
  useEffect(() => {
    let reqData = {};
    if (props.data.title) {
      let countInK = props.data.labels.find(i=>i.countInK);
      let notDirectSeries = Object.keys(props.data.data.find(i=>i)).find(i=>i==='name');
      if (props.data.hasArea) {
        reqData[t('name')]=[
            countInK?t('count') +" * 1000":t('count'),
            t('areaKm2')
        ]
        props.data.labels.map(i=>i.value).forEach((elem, index) => {
          reqData[elem] = [
            props.data?.data[0]?.data[index],
            props.data?.data[1]?.data[index],
          ];
        });
      }else {
        reqData[t('name')]=countInK?t('count') +"*1000":t('count');
        let lbels=[]; let dataSeries = [];
        if(notDirectSeries) {
          dataSeries = props.data.data.map(i=>i.data).flat();
          lbels= props.data.labels.map(i=>i.value);
        }
        else {
          dataSeries = props.data.data;
          lbels =  props.data.labels;
        }
        lbels.forEach((elem, index) => {
          reqData[elem] = dataSeries[index];
        });
    }
    setData(reqData);
    } 
  }, [dataPropsMemo.data, props.data.title]);

//   if (Object.keys(data).length) return <Loader />;
//   else
    return (
      <div className="tbl-beside-map">
        <div className="dashTable2 mt-2">
          {/**Details tbl */}
          <SideTable title={props.data.title} data={data} />
        </div>
      </div>
    );
}

export default SideTbls;
