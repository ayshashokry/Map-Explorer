import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowLeft } from "@mui/icons-material";
import { Input, Radio, Button } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import archiveIcon from "../../assets/images/archiveIcon.svg";
export default function SearchHeader() {
  const [checkValue, setCheckValue] = useState(1);
  const onCheckType = (e) => {
    console.log("radio checked", e.target.value);
    setCheckValue(e.target.value);
  };
  return (
    <div className="searchHeader">
      <p className="headTitle">
        الأرشيف الإلكتروني
        <img alt="icon" className="mx-2" src={archiveIcon} />
      </p>
      <Link to="/">
        <FontAwesomeIcon icon={ArrowLeft} />
      </Link>        <Button className="headBtnSearch">البحث</Button>

      <div className="m-auto headCenter">
        <Radio.Group onChange={onCheckType} value={checkValue}>
          <Radio value={1}>ملف</Radio>
          <Radio value={2}>مجلد</Radio>
        </Radio.Group>
        <Input placeholder="ادخل كلمة البحث" />
      </div>
    </div>
  );
}
