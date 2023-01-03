import React from 'react'
import { Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toArabic } from "arabic-digits";
import { useTranslation } from "react-i18next";
import android from "../assets/images/GooglePlay.png";
import ios from "../assets/images/AppStore.png";
import {
  faEdgeLegacy,
  faFirefoxBrowser,
  faChrome,
  faYoutube,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Navbar, Nav, Container } from "react-bootstrap";

//Images
import Logo from "../assets/images/amanaLogo.png";
export default function MobileAppScreen() {
    const {t,i18n}=useTranslation('common')

  return (
    <div className='appStoreScreen'>
 <Navbar expand="lg" className="portalNavbar1 " fixed="top">
          <Container fluid>
            <Nav>
              <ul className=" leftUl">
              <img className='mobileLogo'
              src={Logo}
              alt="portalLogo"
              style={{
                width: "50px",
                height: "50px",
              }}
            />
                <li className="centerLi">
                  <a
                    className="iconLink"
                    href="https://twitter.com/easterneamana/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon
                      className=" twitterIcon"
                      icon={faTwitter}
                      style={{ fontSize: "20px" }}
                    />
                  </a>
                </li>
                <span className="navitemBorder"></span>
                <li>
                  <a
                    className="iconLink"
                    href="https://www.youtube.com/channel/UC5k-pTxG2WTlj0Bbzcmk6RA"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon
                      className=" youtubeIcon"
                      icon={faYoutube}
                      style={{ fontSize: "20px" }}
                    />
                  </a>
                </li>
              </ul>
            </Nav>
          </Container>
        </Navbar>

<ul className="appStoreUL" style={{ listStyleType: "none",textAlign:'center' }}>
   
            <h5>   {t("downloadApp")}  </h5>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.eamana.webgis"
            >
              <img
                alt="android-download"
                src={android}
                className="img-fluid pt-2"
              />
            </a>
          </li>

          <li className="px-4">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://apps.apple.com/eg/app/%D9%85%D8%AF%D9%8A%D9%86%D8%AA%D9%89/id1237574491"
            >
              <img alt="ios-download" src={ios}                 className="img-fluid pt-2"
 />
            </a>
          </li>
        </ul>
<div className="Appfooter">
      <Container fluid className="px-lg-5 ">
        <Row className="mb-4 pt-3 pr-lg-4 AppfooterRow">
          <Col xs={{ span: 12 }} className="AppfooterColLogo">
            <img
              src={Logo}
              alt="portalLogo"
              style={{
                width: "auto",
                height: "70px",
              }}
            />
          </Col>
          <Col
            xs={{ span: 12 }}
            className="footerTopI pt-4"
          >
            <span>
              <a
                className="iconLink"
                href="https://www.youtube.com/channel/UC5k-pTxG2WTlj0Bbzcmk6RA"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="fa-2x youtubeIcon"
                />
              </a>
            </span>
            <span className="mr-5">
              <a
                className="iconLink"
                href="https://twitter.com/easterneamana/"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="fa-2x twitterIcon"
                />
              </a>{" "}
            </span>
          </Col>
        </Row>
        <Row>
          <Col
           span={24}
          >
            <h4> {t("importantLinks")}</h4>
            <ul>
              <li>
                <a
                  href=" http://www.eamana.gov.sa/"
                  rel="noreferrer"
                  target="_blank"
                >
                  
                  {t("amanaWebsite")}
                </a>
              </li>
              <li>
             
                <a
                  href="https://www.eamana.gov.sa/E-services/Individuals"
                  rel="noreferrer"
                  target="_blank"
                >
                 
                  {t("ElecServices")}
                </a>
              </li>
              <li>
                <a
                  href="https://www.momra.gov.sa/"
                  rel="noreferrer"
                  target="_blank"
                >
                {t("MinistryofMunicipal")}
                </a>
              </li>
              <li>
                <a
                  href=" https://balady.gov.sa/"
                  rel="noreferrer"
                  target="_blank"
                >
                    {t("BaladPortal")}
                </a>
              </li>
              <li>
                {" "}
                <a
                  href="http://www.yesser.gov.sa/ar/Pages/default.aspx"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t("eGovYosr")}
                </a>
              </li>
            </ul>
          </Col>{" "}
     

        </Row>
      </Container>
      {/* <div className="conditions">
        <Row className="pr-lg-5">
          <Col
            xs={{ span: 24 }}
            sm={{ span: 6 }}
            md={{ span: 2 }}
            className="footerBottomIcons"
          >
            <FontAwesomeIcon className=" footIcon" icon={faEdgeLegacy} />
            <FontAwesomeIcon className=" footIcon" icon={faFirefoxBrowser} />
            <FontAwesomeIcon className=" footIcon" icon={faChrome} />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 18 }} md={{ span: 19 }}>
            <h6>الشروط اللازمة التى يجب توافرها فى البيئة المشغلة للموقع </h6>
            <p>
              مقاس الشاشة لا تقل عن 600 يدعم متصفحات جوجل كروم, فيرفوكس, سفاري,و
              ايدج بالإضافة إلى جميع الأجهزة الذكية
            </p>
          </Col>
        </Row>
      </div> */}
      <Container className='footerYearContainer'>
        <p className="footerYear pt-4 pb-2">
          {t("rightsReserv")}
          {i18n.language=="en"?new Date().getFullYear(): toArabic(new Date().getFullYear())}
        </p>
      </Container>
    </div>
    </div>
  )
}
