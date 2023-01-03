import { DownCircleFilled } from "@ant-design/icons";
import { Select } from "antd";
import React from "react";
import { useEffect } from "react";

function SelectComp(props) {
  useEffect(()=>{
    // console.log(props.listName, props.list);
  },[])
  return (
    <>
      <Select
        virtual={false}
        suffixIcon={<DownCircleFilled />}
        showSearch
        allowClear={props.allowClear}
        className="dont-show"
        onChange={(name,e)=>props.onChange(name,e)}
        value={props.value}
        placeholder={props.placeholder}
        getPopupContainer={(trigger) => trigger.parentNode}
        optionFilterProp="value"
        filterOption={(input, option) =>
          {
            return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        }
      >
        {props.list.map((s, index) => {
          if (props.listName === "layers")
            return (
              <Select.Option value={s.englishName} id={s.id}>
                {props.languageStatus === "ar" ? s.arabicName : s.englishName}
              </Select.Option>
            );
          else{
          //  console.log({list:props.list, type:s.type, name:s.name});
            return (
              <Select.Option value={s.type || s.value} key={index + "bound"}>
                {s.name}
              </Select.Option>
            );
          }
        })}
      </Select>
    </>
  );
}

export default SelectComp;
