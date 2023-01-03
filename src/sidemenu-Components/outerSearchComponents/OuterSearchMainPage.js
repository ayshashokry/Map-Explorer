import React from "react";
import { Container } from "react-bootstrap";
import OuterSearchResultDetails from "./OuterSearchResultDetails";
import OuterSearchResultsMenu from "./OuterSearchResultsMenu";

export default function OuterSearchMainPage(props) {

  const outerOpenResultdetailsCallback = (item) => {

    props.map.__selectedItem = item;
    props.outerOpenResultdetails(item);

  }

  return (
    <div className="coordinates mb-4 mt-2">
      <Container>
        {props.outerResultMenuShown ? (
          <OuterSearchResultsMenu
          mainData={props.mainData}
            map={props.map}
            outerResultMenuShown={props.outerResultMenuShown}
            outerSearchResult={props.outerSearchResult}
            outerOpenSearchInputs={props.outerOpenSearchInputs}
            outerOpenResultdetails={outerOpenResultdetailsCallback}
          />
        ) : props.outerResultDetailsShown ? (
          <OuterSearchResultDetails
          mainData={props.mainData}
            outerOpenSearchInputs={props.outerOpenSearchInputs}
            outerOpenResultMenu={props.outerOpenResultMenu}
            data={props.outerSearchResult.length > 1 ? props.map.__selectedItem : props.outerSearchResult[0]}
            map={props.map}
          />
        ) : null}
      </Container>
    </div>

  );
}
