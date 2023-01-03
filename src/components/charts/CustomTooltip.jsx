import React, { useContext } from "react";

import useMousePosition from "./useMousePosition.jsx";

const TooltipContext = React.createContext();

//Function for all those little tooltip context consumers out there
export function useTooltipContext() {
  const tooltipContext = useContext(TooltipContext);
  return tooltipContext;
}

//Tooltip provider - place somewhere in your app with access to full window
//width. You can use the same thing for all of your tooltips, and the callback
//functions openTooltip and closeTooltip will modify it's state
export default function CustomTooltip({ children }) {
  const emptyTooltip = {
    open: false,
    content: null,
    style: null
  };
  const [tooltip, setTooltip] = React.useState(emptyTooltip);

  const openTooltip = ({ content, style }) => {
    setTooltip({
      open: true,
      content: content,
      style: style
    });
  };

  const closeTooltip = () => {
    setTooltip(emptyTooltip);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Tooltip tooltip={tooltip} />
      <TooltipProvider openTooltip={openTooltip} closeTooltip={closeTooltip}>
        {children}
      </TooltipProvider>
    </div>
  );
}

const Tooltip = ({ tooltip }) => {
  const position = useMousePosition();
  //This part is essential to the tooltip functioning properyly, but
  //I haven't thought of a way to stop listening to useMousePosition
  //when the tooltip is closed
  const left = tooltip.open ? position.x : -9999;
  const top = tooltip.open ? position.y : -9999;

  return (
    <div
      style={{
        position: "fixed",
        left: left + 5,
        top: top + 5,
        zIndex: 9999,
        ...tooltip.style
      }}
    >
      {tooltip.content}
    </div>
  );
};

//Used in the CustomTooltip wrapper above
function TooltipProvider({ children, openTooltip, closeTooltip }) {
  const tooltipContext = React.useMemo(() => {
    return {
      openTooltip: openTooltip,
      closeTooltip: closeTooltip
    };
  }, [openTooltip, closeTooltip]);

  return (
    <TooltipContext.Provider value={tooltipContext}>
      {children}
    </TooltipContext.Provider>
  );
}
