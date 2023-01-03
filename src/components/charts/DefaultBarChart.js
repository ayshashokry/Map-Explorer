import React, { Component } from "react";
import { BarChart, Bar, Cell } from "recharts";

export default class Example extends Component {
  state = { data: null, isShowTooltip: false, tootlip: "" };

  componentDidMount() {
    if (this.props.data) {
      this.setState({
        data: this.props.data.chartData.map((d, index) => {
          return {
            name: d.attributes.INDICATOR_SUBTYBE || d.attributes.INDICATOR_NAME,
            colorHex: d.attributes.colorHex || "#000",
            value: +d.attributes.INDICATOR_VALUE,
            id: index,
          };
        }),
      });
    }
  }

  openTooltip = (e) => {
    if (!this.state.isShowTooltip)
      this.setState({ isShowTooltip: true, tootlip: e.name + " : " + e.value });
  };

  closeTooltip = (e) => {
    if (this.state.isShowTooltip) this.setState({ isShowTooltip: false });
  };

  render() {
    return (
      <div
        className="pieChartClass"
        style={{ marginBottom: "20px", display: "flex" }}
      >
        {this.state.isShowTooltip && (
          <label className="barChartTootltip">{this.state.tootlip}</label>
        )}

        <div style={{ opacity: "0.8" }}>
          <BarChart
            width={this.props.width || 60}
            height={this.props.height || 60}
            data={this.state.data}
            barSize={this.props.barSize || 15}
            margin={{
              bottom: 10,
            }}
          >
            <Bar
              dataKey="value"
              onMouseEnter={(e) => this.openTooltip(e)}
              onMouseLeave={() => this.closeTooltip()}
            >
              {this.state.data &&
                this.state.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.colorHex} />
                ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    );
  }
}
