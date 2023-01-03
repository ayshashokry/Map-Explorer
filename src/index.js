import React, { Fragment, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router} from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import "antd/dist/antd.css";

import "./i18n";
import i18n from "./i18n";
ReactDOM.render(
  // <React.StrictMode>
  
  <Suspense fallback={null}>
    <Fragment>
      <ConfigProvider direction={i18n.language==='ar'?"rtl":"ltr"}>
      <Router basename={process.env.PUBLIC_URL}>

        <App />
        </Router>
      </ConfigProvider>
    </Fragment>
  </Suspense>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
