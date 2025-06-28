import React, { useEffect, useState } from "react";
import {
  LineChart,
  GridlineSeries,
  Gridline,
  LineSeries,
  LinearXAxisTickSeries,
  LinearXAxis,
} from "reaviz";
import TitleChart from "../../elements/text/TitleChart";
import { CircleAlert, Meh, ThumbsUp } from "lucide-react";
import { analyzeRatingTrend } from "../../../utils/analyze.Dashboard";

function LineChartDash({ data, title, content }) {
  const [insights, setInsights] = useState([
    {
      sentiment: "neutral",
      message: "Loading insights...",
    },
  ]);
  useEffect(() => {
    if (data && content === "ratingPeriod") {
      const result = analyzeRatingTrend(data);
      setInsights(result);
    }
  }, [data, content]);
  return (
    <>
      <TitleChart>{title}</TitleChart>
      <div
        className={
          "relative flex flex-col max-w-full max-h-full overflow-hidden rounded-lg h-[400px] max-w-full"
        }
      >
        <LineChart
          id="all-axes"
          data={data}
          gridlines={<GridlineSeries line={<Gridline direction="all" />} />}
          series={<LineSeries labelPosition="top" />}
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

export default LineChartDash;
