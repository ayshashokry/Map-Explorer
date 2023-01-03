import React from "react";

export default function SideTable(props) {
  let hasArea = Object.values(props.data).length ?
  typeof Object.values(props.data)[0] === "object":'';
  return (
    <>
      <p className="dashTableTitle"> {props.title}</p>
    <table className="table table-bordered dashboardMapTable1">
      <tbody>
        {Object.entries(props.data).map((item, index) => {
          if (hasArea)
            return (
              <tr key={index + "asd"} style={!index?{fontWeight:'bolder'}:{}}>
                <td>{item[0]}</td>
                <td>{item[1][0]}</td>
                <td>{item[1][1]}</td>
              </tr>
            );
          else
            return (
              <tr key={index + "asd"} style={!index?{fontWeight:'bolder'}:{}}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
              </tr>
            );
        })}
      </tbody>
    </table>
    </>
  );
}
