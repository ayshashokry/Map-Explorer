import React, { useState, useEffect } from "react";
//hijri date-picker
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import english from "react-date-object/calendars/gregorian";
import arabic_ar from "react-date-object/locales/arabic_ar";
import english_en from "react-date-object/locales/gregorian_en";
import english_ar from "react-date-object/locales/gregorian_ar";

//i18next translation
import { useTranslation } from "react-i18next";
//icons & styles
import { CloseCircleFilled, DownCircleFilled } from "@ant-design/icons";
import { Select } from "antd";
import { getNoDaysPerMonth } from "../../../helper/utilsFunc";

function HijriCalenderComp(props) {
  const { t, i18n } = useTranslation("dashboard");
  const calendarRef = React.useRef(null);
  const [dateValues, setDateValues] = useState();
  const [onTheFlyDateData, setOnTheFlyDateData] = useState({
    month: { value: undefined, monthsList: [] },
    year: { value: undefined, yearsList: [] },
  });
  useEffect(() => {
    //todo: reset calender value at the first time this component renders
    return () => {
      if (calendarRef?.current) {
        calendarRef.current.value = undefined;
      }
      setOnTheFlyDateData();
      setDateValues();
    };
  }, []);
  useEffect(()=>{
    console.log("calendarRef.current before condition");
    if(calendarRef.current){
      console.log("in case of getting a value with calendarRef.current");
      calendarRef.current.value = undefined;
    }
  },[calendarRef.current])
  useEffect(() => {
    let currentData = new DateObject({
      calendar: i18n.language === "ar" ? english : english,
      locale: i18n.language === "ar" ? english_ar : english_en,
    });

    let month = { ...onTheFlyDateData.month, monthsList: currentData.months };
    setOnTheFlyDateData({ ...onTheFlyDateData, month });
  }, [i18n.language]);
  useEffect(() => {
    if(props.queryData?.selectedTimeContext?.type) setOnTheFlyDateData(resetOnTheFlyDateData());
  }, [props.queryData?.selectedTimeContext?.type]);



  function handleChange(value) {
    let { queryData, setQueryData } = props;
    console.log("calendar ref", calendarRef.current);
    console.log(value);
    //your modification on passed value ....
    if (value?.length === 1) {
      let isNotSameSelectedDate =queryData.selectedTimeContext.dateData.length?
      checkIfSelectedSameSingleDate(queryData, value):true;
      if(!isNotSameSelectedDate) return;
      else 
      setDateValues(value)
    }else{
      let isNotSameSelectedDate =queryData.selectedTimeContext.dateData.length?
      checkIfSelectedSameDates(queryData, value):true;
      if(!isNotSameSelectedDate) return;
      else 
      setDateValues(value)
    }
    setQueryData({
      ...queryData,
      selectedTimeContext: {
        ...queryData.selectedTimeContext,
        dateData: value,
      },
    });
  }
  const handleSelect = (name) => (value, e) => {
    props.handleClearCalender();  //todo: fix issue of removing linechart in case of hitting this
    setDateValues()
    if (name === "year") {
      console.log({
        ...onTheFlyDateData,
        year: { ...onTheFlyDateData.year, value: value },
      });
      setOnTheFlyDateData({
        ...onTheFlyDateData,
        year: { ...onTheFlyDateData.year, value: value },
      });
    } else if (name === "month") {
      console.log({
        ...onTheFlyDateData,
        month: { ...onTheFlyDateData.month, value: value },
      });
      setOnTheFlyDateData({
        ...onTheFlyDateData,
        month: { ...onTheFlyDateData.month, value: value },
      });
    }
  };

  const resetOnTheFlyDateData = () => {
    if(calendarRef.current)calendarRef.current.value = undefined; 
    setDateValues();
    let currentData = new DateObject({
      calendar: i18n.language === "ar" ? english : english,
      locale: i18n.language === "ar" ? english_ar : english_en,
    });
    let yearsList = [];
    for (let index = 0; index < 10; index++) {
      const element = currentData.year - index;
      yearsList.push(element);
    }
    let year = {
      value: undefined,
      yearsList: yearsList,
    };

    let month = { value: undefined, monthsList: currentData.months };
    return {
      month,
      year,
    };
  };

  const checkIfSelectedSameSingleDate = (queryData, currentSelectedDate)=>{
    if(props.type === 'yearly'){
      let oldStartDate = queryData.selectedTimeContext.dateData[0].year;
      let currentStartDate = currentSelectedDate[0].year;
      if (oldStartDate===currentStartDate) return;
      else return true;
      }else if(props.type==='monthly'){
        let oldStartDateYear = queryData.selectedTimeContext.dateData[0].year;
        let oldStartDateMonth = queryData.selectedTimeContext.dateData[0].month;
        let currentStartDateYear = currentSelectedDate[0].year;
        let currentStartDateMonth = currentSelectedDate[0].month;
        if (oldStartDateYear===currentStartDateYear&&oldStartDateMonth===currentStartDateMonth) return;
      else return true;
          
      }else{
        let oldStartDateYear = queryData.selectedTimeContext.dateData[0].year;
        let oldStartDateMonth = queryData.selectedTimeContext.dateData[0].month;
        let oldStartDateDay = queryData.selectedTimeContext.dateData[0].day;
        let currentStartDateYear = currentSelectedDate[0].year;
        let currentStartDateMonth = currentSelectedDate[0].month;
        let currentStartDateDay = currentSelectedDate[0].day;
        if (oldStartDateYear===currentStartDateYear
          &&
          oldStartDateMonth===currentStartDateMonth
          &&
          oldStartDateDay===currentStartDateDay
          ) return;
      else return true;
        
      }
  }

   const checkIfSelectedSameDates = (queryData, currentSelectedDates)=>{
    if(props.type === 'yearly'){
      let currentStartDate = currentSelectedDates[0].year;
      let currentEndDate = currentSelectedDates[1].year;
      if (currentEndDate===currentStartDate) return;
      else return true;
      }else if(props.type==='monthly'){
        let currentStartDateYear = currentSelectedDates[0].year;
        let currentEndDateYear = currentSelectedDates[1].year;
        let currentStartDateMonth = currentSelectedDates[0].month;
        let currentEndDateMonth = currentSelectedDates[1].month;
        if (currentEndDateYear===currentStartDateYear&&currentEndDateMonth===currentStartDateMonth) return;
      else return true;
          
      }else{
        let currentStartDateYear = currentSelectedDates[0].year;
        let currentEndDateYear = currentSelectedDates[1].year;
        let currentStartDateMonth = currentSelectedDates[0].month;
        let currentEndDateMonth = currentSelectedDates[1].month;
        let currentStartDateDay = currentSelectedDates[0].day;
        let currentEndDateDay = currentSelectedDates[1].day;
        if (currentEndDateYear===currentStartDateYear
          &&
          currentEndDateMonth===currentStartDateMonth
          &&
          currentEndDateDay===currentStartDateDay
          ) return;
      else return true;
        
      }
  }
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <span
        className="clear-calendar-icon"
        disabled={!props.queryData.selectedTimeContext?.dateData?.length}
        style={{
          cursor: !props.queryData.selectedTimeContext?.dateData?.length
            ? "no-drop"
            : "pointer",
        }}
        title={t("clear")}
        onClick={(e) => {
          // e.preventDefault();
          console.log("clear");
          setDateValues([]);
          calendarRef.current.value = undefined;
          props.handleClearCalender();
        }}
      >
        <CloseCircleFilled />
      </span>

      {props.type === "yearly" ||
        props.type === "monthly" ||
        props.type === "daily" ? (
        <DatePicker disabled={!(props.type === "yearly" ||
        (props.type === "monthly" && onTheFlyDateData.year?.value) ||
        (props.type === "daily" &&
          onTheFlyDateData.month?.value &&
          onTheFlyDateData.year?.value))}
          minDate={
            props.type === "yearly"
              ? ""
              : props.type === "monthly" && onTheFlyDateData.year?.value
                ? new DateObject().set({
                  format: "YYYY/M",
                  calendar: i18n.language === "ar" ? english : english,
                  // locale: i18n.language === "ar" ? english_ar : english_en,
                  year: onTheFlyDateData.year?.value,
                  month: 1,
                })
                : props.type === 'daily' && onTheFlyDateData.year?.value && onTheFlyDateData.month?.value ?
                  new DateObject().set({
                    format: "YYYY/M/D",
                    calendar: i18n.language === "ar" ? english : english,
                    locale: i18n.language === "ar" ? english_ar : english_en,
                    year: onTheFlyDateData.year?.value,
                    month: onTheFlyDateData.month?.value,
                    day: 1
                  }) : ''
          }
          maxDate={
            props.type === "yearly"
              ? ""
              : props.type === "monthly" && onTheFlyDateData.year?.value
                ? new DateObject().set({
                  format: "YYYY/M",
                  calendar: i18n.language === "ar" ? english : english,
                  locale: i18n.language === "ar" ? english_ar : english_en,
                  year: onTheFlyDateData.year?.value,
                  month: 12,
                })
                : props.type === 'daily' && onTheFlyDateData.year?.value && onTheFlyDateData.month?.value ? new DateObject().set({
                  format: "YYYY/M/D",
                  calendar: i18n.language === "ar" ? english : english,
                  locale: i18n.language === "ar" ? english_ar : english_en,
                  year: onTheFlyDateData.year?.value,
                  month: onTheFlyDateData.month?.value,
                  day:getNoDaysPerMonth(onTheFlyDateData.month?.value)
                }) : ''
          }
          ref={calendarRef}
          // multiple     //to do this option: you must edit getCountDataPerPeriod method
          range
          fixMainPosition
          // editable={false}
          calendarPosition="bottom-left"
          onlyMonthPicker={props.type === "monthly" ? true : false}
          onlyYearPicker={props.type === "yearly" ? true : false}
          calendar={i18n.language === "ar" ? english : english}
          locale={i18n.language === "ar" ? english_ar : english_en}
          value={
            props.type === "yearly"
              ? dateValues
              : props.type === "monthly" && dateValues?.length
                ? dateValues
                : props.type === "monthly" && !(dateValues?.length)
                  ? new DateObject().set({
                    format: "YYYY/MM",
                    year: onTheFlyDateData.year.value,
                    month: 1,
                    day:1,
                    calendar: i18n.language === "ar" ? english : english,

                    locale: i18n.language === "ar" ? english_ar : english_en,
                  })
                  : props.type === "daily" && dateValues?.length
                    ? dateValues
                    : new DateObject().set({
                      format: "YYYY/MM/DD",
                      year: onTheFlyDateData.year.value,
                      month: onTheFlyDateData.month.value,
                      day: 1,
                      calendar: i18n.language === "ar" ? english : english,
                      locale: i18n.language === "ar" ? english_ar : english_en,
                    })
          }
          onChange={handleChange}
          style={
            i18n.language === "ar" ? { direction: "rtl" } : { direction: "ltr" }
          }
          placeholder={t("chooseFromCalendar")}
          sort={true}
          hideOnScroll={true}
        />
      ) : null}
      {["daily"].includes(props.type) && onTheFlyDateData.year.value ? (
        <>
          <div className="select-year-month">
            <Select
              virtual={false}
              suffixIcon={<DownCircleFilled />}
              showSearch
              allowClear
              className="dont-show"
              onChange={handleSelect("month")}
              value={onTheFlyDateData.month.value}
              placeholder={t("chooseMonth")}
              getPopupContainer={(trigger) => trigger.parentNode}
              optionFilterProp="value"
              filterOption={(input, option) =>
                option.value && option.value.indexOf(input) >= 0
              }
            >
              {onTheFlyDateData.month.monthsList.map((s, index) => (
                <Select.Option value={s.number} key={index}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </>
      ) : null}
      {["monthly", "daily"].includes(props.type) ? (
        <>
          <div className="select-year-month">
            <Select
              virtual={false}
              suffixIcon={<DownCircleFilled />}
              showSearch
              allowClear
              className="dont-show"
              onChange={handleSelect("year")}
              value={onTheFlyDateData.year.value}
              placeholder={t("chooseYear")}
              getPopupContainer={(trigger) => trigger.parentNode}
              optionFilterProp="value"
              filterOption={(input, option) =>
                option.value && option.value.indexOf(input) >= 0
              }
            >
              {onTheFlyDateData.year.yearsList.map((s, index) => (
                <Select.Option value={s} key={index}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default HijriCalenderComp;
