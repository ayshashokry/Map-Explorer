import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faBuilding,
  faFilePdf,
  faInfo,
  faSearchPlus,
  faSitemap,
} from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Fade from "react-reveal/Fade";
import { Tooltip } from "@mui/material";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import OuterSearchResultDetails from "../outerSearchComponents/OuterSearchResultDetails";

export default function GeneralResultDetails(props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [iconsData] = useState([
    { id: 0, icon: faGoogle, tooltip: "خرائط جوجل", data: "Google Data" },
    { id: 1, icon: faSearchPlus, tooltip: "تكبير", data: "Zoom Data" },
    {
      id: 2,
      icon: faSitemap,
      tooltip: "بيانات قطع الأراضي",
      data: "lands Data",
    },
    {
      id: 3,
      icon: faBuilding,
      tooltip: "اشتراطات البناء",
      data: "building condition Data",
    },
    {
      id: 4,
      icon: faFilePdf,
      tooltip: "رخص البناء",
      data: "building license Data",
    },
    { id: 5, icon: faBorderAll, tooltip: "حدود الأمانة", data: "Amanaaaa" },
    {
      id: 6,
      icon: faFile,
      tooltip: "بيانات المنح الملكية",
      data: "Google Data",
    },
  ]);
  return (

    <OuterSearchResultDetails {...props} />
    /*<div className="generalResultDetails cardDetailsHelp">
      <Tabs
        defaultFocus={false}
        selectedIndex={selectedTab}
        onSelect={(x) => setSelectedTab(x)}
      >
        <TabList>
          <Tab>
            <Tooltip title={"النتائج"} placement="top">
              <IconButton className="tooltipButton">
                <FontAwesomeIcon
                  icon={faInfo}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Tab>
          {iconsData.map((ic, index) => (
            <Tab>
              <Tooltip title={ic.tooltip} placement="top">
                <IconButton className="tooltipButton">
                  <FontAwesomeIcon
                    icon={ic.icon}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Tab>
          ))}
        </TabList>
        <TabPanel>
          <Fade bottom>
            <Table striped responsive hover className="mt-2">
              <tr>
                <th>رقم الأرض </th> <td>22</td>
              </tr>
              <tr>
                <th>اسم البلدية </th>

                <td>الدمام</td>
              </tr>
              <tr>
                <th>اسم الحي </th>

                <td>حي الشارقة</td>
              </tr>
              <tr>
                <th>سؤال </th>

                <td>جواب</td>
              </tr>
            </Table>
          </Fade>
        </TabPanel>{" "}
        {iconsData.map((icon, index) => (
          <TabPanel>
            <Fade right>
              <Table striped responsive hover className="mt-2">
                <tr>
                  <th>دائرة العرض </th> <td>نعم</td>
                </tr>
                <tr>
                  <th>خط الطول </th> <td>نعم</td>
                </tr>
                <tr>
                  <th>تصنيف البلاغ </th> <td>نعم</td>
                </tr>
                <tr>
                  {" "}
                  <th>تاريخ الانشاء </th> <td>نعم</td>
                </tr>
                <tr>
                  <th>اسم الموقع </th> <td>نعم</td>
                </tr>
                <tr>
                  <th>اسم الشارع </th> <td>نعم</td>
                </tr>
                <tr>
                  <th> اسم الحي </th> <td>نعم</td>
                </tr>
                <tr>
                  {" "}
                  <th>اسم البلدية </th> <td>نعم</td>
                </tr>
                <tr>
                  <th> رقم الطلب</th> <td>نعم</td>
                </tr>
              </Table>
            </Fade>
          </TabPanel>
        ))}
      </Tabs>
    </div>*/
  );
}
