import { Check, CircleAlert, Meh, ThumbsUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  BarLabel,
  BarSeries,
  Gridline,
  GridlineSeries,
  LinearXAxis,
  LinearXAxisTickSeries,
  LinearYAxis,
  LinearYAxisTickLabel,
  LinearYAxisTickSeries,
} from "reaviz";
import TitleChart from "../../elements/text/TitleChart";
import {
  analyzeRatingFromChartData,
  analyzeUsageDurationChartData,
} from "../../../utils/analyze.Dashboard";

function HorizBarChartDash({ data, title, content }) {
  const [insights, setInsights] = useState([
    {
      sentiment: "neutral",
      message: "Loading insights...",
    },
  ]);

  useEffect(() => {
    if (data && content === "rating") {
      const result = analyzeRatingFromChartData(data);
      setInsights(result);
    }
    if (data && content === "usedProduct") {
      const result = analyzeUsageDurationChartData(data);
      setInsights(result);
    }
  }, [data, content]);

  return (
    <>
      <TitleChart>{title}</TitleChart>
      <div
        className={
          "relative flex flex-col max-w-full max-h-full overflow-hidden rounded-lg h-[400px]"
        }
      >
        <BarChart
          id="RatingChart"
          data={data}
          yAxis={
            <LinearYAxis
              type="category"
              tickSeries={
                <LinearYAxisTickSeries
                  label={<LinearYAxisTickLabel format={(text) => `${text}`} />}
                />
              }
            />
          }
          xAxis={
            <LinearXAxis type="value" tickSeries={<LinearXAxisTickSeries />} />
          }
          series={
            <BarSeries
              layout="horizontal"
              labelPosition="top"
              bar={
                <Bar
                  glow={{
                    opacity: 0.5,
                  }}
                  gradient={null}
                  label={<BarLabel fill={""} position={"top"} />}
                />
              }
              colorScheme={["#9152EE", "#40D3F4", "#40E5D1", "#4C86FF"]}
              padding={0.2}
            />
          }
          gridlines={
            <GridlineSeries
              line={<Gridline strokeColor="#7E7E8F75" direction="all" />}
            />
          }
        />
      </div>
      <div className="flex flex-col pt-8 font-mono divide-y divide-[#262631]">
        {insights.map((insight) => (
          <div className="flex w-full pb-4 pt-4 items-center gap-2">
            <div className="pt-1 items-center">
              {insight.sentiment === "positive" && (
                <ThumbsUp size={24} className="text-green-300" />
              )}
              {insight.sentiment === "negative" && (
                <CircleAlert size={24} className="text-red-300" />
              )}
              {insight.sentiment === "neutral" && (
                <Meh size={24} className="text-yellow-300" />
              )}
            </div>
            <span className="text-base text-[#9A9AAF]">{insight.message}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default HorizBarChartDash;
