import React, { Component } from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default class Example extends Component {
  state = { data: null };

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
  render() {
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index,
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      this.state.data && (
        <div className="pieChartClass">
          <PieChart
            isAnimationActive={true}
            width={this.props.width || 75}
            height={this.props.height || 75}
          >
            <Pie
              isAnimationActive={true}
              data={this.state.data}
              cx="50%"
              cy="50%"
              width={this.props.width || 50}
              height={this.props.height || 50}
              labelLine={false}
              outerRadius={this.props.outerRadius || 25}
              fill="#8884d8"
              dataKey="value"
            >
              {this.state.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.colorHex} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      )
    );
  }
}
