import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
function PaginationComp({
  currentPageNum,
  setCurrentPageNum,
  isCurrent,
  searchTableDisplay,
}) {
  const increasePageNumber = () => {
    console.log("increase page number ");
    let increasedPAgNum = {};
    isCurrent
      ? (increasedPAgNum.current = currentPageNum.current + 1)
      : (increasedPAgNum.dep = currentPageNum.dep + 1);
    setCurrentPageNum({ ...currentPageNum, ...increasedPAgNum });
  };

  return (
    <div className="pagination-container">
      <div
        className="btn btn-secondary  px-3  seeMoreBtn text-center"
        onClick={increasePageNumber}
      >
        <FontAwesomeIcon
          className="closeIconsIcon"
          icon={faAngleDoubleDown}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default PaginationComp;
