/* eslint-disable */
import React from "react";
import ReactJoyride, {
  STATUS,
  ACTIONS,
  EVENTS,
  LIFECYCLE,
} from "react-joyride";
import { useTranslation } from "react-i18next";
export default function MainPageHelp(props) {
  const { t } = useTranslation("help");

  const handleJoyrideCallback = (data) => {
    const { status, type, action } = data;
    if ([EVENTS.TOUR_END].includes(type)) {
      props.helpName === "main"
        ? localStorage.setItem("showHelp", true)
        : props.helpName === "openSideMenu"
        ? localStorage.setItem("showOpenSideHelp", true)
        : null;
    }
    if ([LIFECYCLE.COMPLETE].includes(type)) {
      props.helpName === "main"
        ? localStorage.setItem("showHelp", true)
        : props.helpName === "openSideMenu"
        ? localStorage.setItem("showOpenSideHelp", true)
        : null;
    }
    if ([STATUS.SKIPPED].includes(status)) {
      props.helpName === "main"
        ? localStorage.setItem("showHelp", true)
        : props.helpName === "openSideMenu"
        ? localStorage.setItem("showOpenSideHelp", true)
        : null;
    }
    if ([ACTIONS.CLOSE].includes(action)) {
      props.helpName === "main"
        ? localStorage.setItem("showHelp", true)
        : props.helpName === "openSideMenu"
        ? localStorage.setItem("showOpenSideHelp", true)
        : null;
    }
  };
  let helpSteps =
    props.helpName === "main"
      ? [
          {
            target: ".openCloseToolServHelp",
            content: t("openCloseToolServHelp"),
            disableBeacon: true,
          },
          {
            target: ".servicesHelp",
            content: t("servicesHelp"),
          },
          {
            target: ".fullscreenServHelp",
            content: t("fullscreenServHelp"),
          },
          {
            target: ".toolsHelp",
            content: t("toolsHelp"),
          },
          {
            target: ".outerSearchHelp",
            content: t("outerSearchHelp"),
          },
          {
            target: ".openSideMenuHelp",
            content: t("openSideMenuHelp"),
          },
          {
            target: ".mapToolsHelp",
            content: t("mapToolsHelp"),
          },
        ]
      : props.helpName === "openSideMenu"
      ? [
          {
            target: ".openSideHelp",
            disableBeacon: true,
            content: t("openSideHelp"),
          },
        ]
      : null;
  return (
    <>
      {console.log(props.helpName)}
      {props.helpName === "main" || props.helpName === "openSideMenu" ? (
        <ReactJoyride
          locale={{
            back: t("back"),
            close: t("close"),
            last: t("last"),
            next: t("next"),
          }}
          callback={handleJoyrideCallback}
          steps={helpSteps}
          disableCloseOnEsc
          run={true}
          continuous
          showProgress
          disableOverlayClose
          showSkipButton
          styles={{
            options: {
              arrowColor: "rgba(255, 255, 255, .9)",
              backgroundColor: "rgba(255, 255, 255, .9)",
              overlayColor: "rgba(31, 75, 89, .4)",
              primaryColor: "#000",
              textColor: "#1f4b59",
              zIndex: 9000000,
            },
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
