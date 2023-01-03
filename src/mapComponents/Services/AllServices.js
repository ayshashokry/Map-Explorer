import React from "react";
import ServicesSearch from "./ServicesSearch";

export default function AllServices(props) {
  return (
    <div className="allToolsPage">
      {props.activeService ? (
        <ServicesSearch
          map={props.map}
          closeServiceSearch={props.closeServiceSearch}
          openServiceSearch={props.openServiceSearch}
          activeService={props.activeService}
          openServSearch={props.openServSearch}
        />
      ) : null}
    </div>
  );
}
