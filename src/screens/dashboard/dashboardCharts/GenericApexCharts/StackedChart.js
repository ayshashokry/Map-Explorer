import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function StackedChartComp(props) {
  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({});
  useEffect(() => {
    setSeries([{
      name: 'تجارية',
      data: [44, 55, 41, 67]
    }, {
      name: 'سكنية',
      data: [13, 23, 20, 8,]
    }, {
      name: 'صناعية',
      data: [11, 17, 15, 15]
    },
    {
      name: 'خدمية',
      data: [21, 7, 25, 13,]
    }]);
    setOptions({
      chart: {
        // width: "100%",
        // height: 380,
      
        type: "bar",
        stacked: true,
          stackType: "100%",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      title: {
        text: props.title,
        align:'center',
        style:{
          fontSize:  '18px',
          fontWeight:  'bold',
          fontFamily:'NeoSansArabic'
        }
      },
      legend: {
        show: false
      },
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
       tooltip: {
          y: {
            formatter: function (val) {
              return val + "K"
            }
          }
        },
      xaxis: {
        // type: 'datetime',
        categories: ['2011', '2012', '2013', '2014',
          //   '01/05/2011 GMT', '01/06/2011 GMT'
        ],
        
      },
      yaxis: {
        tickAmount: 5,
         max: 100,
         labels: {
            offsetX: -15,
            rotate: -45,
            formatter: (val) => { return val +"%"},
          },
        // forceNiceScale: true,
        title: {
          text: undefined
        },
      },
    }
    )
    return ()=>{
      setSeries([]);
      setOptions({})
    }
  }, [props.preparedChartData]);
  useEffect(()=>{
    if(props.sideTblTitle===props.title){
      props.onClickTitle({
        data: series,
        title: props.title,
        labels,
      })
    }
    
  },[series])
  return (

    <div className="ape-chart">
      <ReactApexChart options={props.options || options} series={props.series|| series} type="bar"
      // height={200}

      />
    </div>

  );
}

export default StackedChartComp;