import React, { useEffect, useState } from "react";
import { Count } from "reaviz";
import { extractCurrencySymbol, extractNumber } from "../../utils/cleaner";
import {
  Check,
  Frown,
  Meh,
  MessageCircleMore,
  Smile,
  Star,
  StarHalf,
  X,
} from "lucide-react";
import HorizBarChartDash from "./charts/HorizBarChartDash";
import TitleChart from "../elements/text/TitleChart";
import CardList from "./charts/CardList";
import ImageSlider from "./charts/ImageSlider";
import LineChartDash from "./charts/LineChartDash";
import {
  exportBestBuyToExcel,
  exportProductToExcel,
} from "../../utils/convercation";
import ButtonGeneral from "../elements/ButtonGeneral";
// function Dashboard({ data }) {
//   return (
//     <>
//       <h3 className="font-bold">{data.response.title}</h3>
//       <p>{data.id}</p>
//       <p>{data.response.price}</p>
//       <p>{data.response.product_url}</p>
//       <p>{data.response.review_url}</p>
//       <p>{data.response.result}</p>
//       <div className="flex">
//         {data.response.images.map((image) => (
//           <img src={image} alt="" />
//         ))}
//       </div>
//       {data.response.total_review !== undefined && (
//         <p className="mt-2">Total Review: {data.response.total_review}</p>
//       )}
//       {data.response.analysis?.sentiment_summary !== undefined && (
//         <div className="flex">
//           <p className="mt-2">
//             Positive: {data.response.analysis?.sentiment_summary.positive}
//           </p>
//           <p className="mt-2">
//             Negative: {data.response.analysis?.sentiment_summary.negative}
//           </p>
//           <p className="mt-2">
//             Neutral: {data.response.analysis?.sentiment_summary.neutral}
//           </p>
//         </div>
//       )}
//       {data.response.analysis?.top_cons !== undefined && (
//         <p className="mt-2">
//           Positive:{" "}
//           {data.response.analysis.top_cons.map((word) => (
//             <span>
//               {word[0]}
//               {", "}
//             </span>
//           ))}
//         </p>
//       )}

//       {data.response.analysis?.top_pros !== undefined && (
//         <p className="mt-2">
//           Negative:{" "}
//           {data.response.analysis?.top_pros.map((word) => (
//             <span>
//               {word[0]}
//               {", "}
//             </span>
//           ))}
//         </p>
//       )}
//       {data.response.analysis?.word_cloud_data !== undefined && (
//         <p className="mt-2">
//           Positive:{" "}
//           {data.response.analysis.word_cloud_data.map((word) => (
//             <span>
//               {word[0]}
//               {", "}
//             </span>
//           ))}
//         </p>
//       )}

//       {Array.isArray(data.response.reviews) ? (
//         data.response.reviews.map((review, idx) => (
//           <div key={idx}>
//             <p className="font-bold">{review.author}</p>
//             <p>{review.title}</p>
//             <p>{review.body}</p>
//             <p>Rating: {review.rating}</p>
//             <div className="flex">
//               {review.images &&
//                 review.images.map((img, index) => (
//                   <img key={index} src={img} alt="" />
//                 ))}
//             </div>
//             <p>{review.recommendation && "rekomen"}</p>
//           </div>
//         ))
//       ) : (
//         <p>{data.response.reviews}</p>
//       )}
//     </>
//   );
// }

function Dashboard({ data }) {
  console.log("A");
  const title = data.response.title;
  const images = data.response.images;
  let recommendationRate = 0;
  let totalReviews = 0;
  let price = 0;
  let averageRating = 0;
  let topCons = [];
  let topPros = [];
  let wordCloud = [];
  let reviews = [];

  let sentimentSummary = {
    negative: 0,
    neutral: 0,
    positive: 0,
  };
  const ratingCount = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let ratingChartData = Object.entries(ratingCount).map(([star, count]) => ({
    key: parseInt(star),
    data: count,
  }));
  const usageDurationCount = {
    "less than 1 month": 0,
    "1 - 6 months": 0,
    "6 - 12 months": 0,
    "more than a year": 0,
  };

  let usageDurationChartData = Object.entries(usageDurationCount).map(
    ([key, count]) => ({
      key,
      data: count,
    })
  );

  const postedMonthCount = {};

  let postedMonthChartData = Object.entries(postedMonthCount).map(
    ([key, count]) => ({
      key,
      data: count,
    })
  );

  if (data.response.analysis) {
    topCons = data.response.analysis?.top_cons.map(([label, value]) => ({
      label,
      value,
    }));
    topPros = data.response.analysis?.top_pros.map(([label, value]) => ({
      label,
      value,
    }));
    sentimentSummary = data.response.analysis?.sentiment_summary;
    wordCloud = data.response.analysis?.word_cloud_data.map(([key, value]) => ({
      key,
      data: value,
    }));
  }

  if (Array.isArray(data.response.reviews)) {
    reviews = data.response.reviews;

    totalReviews = reviews.length;

    for (const review of reviews) {
      const posted = review.review_info?.posted;
      if (posted && posted.label) {
        const label = posted.label; // Misal "August"
        postedMonthCount[label] = (postedMonthCount[label] || 0) + 1;
      }

      // Duration Used
      const used = review.review_info?.used_duration;

      if (used?.value) {
        const dur = used.duration || "unknown";
        usageDurationCount[dur] = (usageDurationCount[dur] || 0) + 1;
      } else {
        usageDurationCount["not used yet"] =
          (usageDurationCount["not used yet"] || 0) + 1;
      }
    }
    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    postedMonthChartData = Object.entries(postedMonthCount)
      .map(([label, count]) => {
        const monthIndex = monthOrder.indexOf(label);
        return {
          key: new Date(2025, monthIndex, 1),
          data: count,
        };
      })
      .sort((a, b) => a.key - b.key);

    postedMonthChartData.sort(
      (a, b) => monthOrder.indexOf(a.key) - monthOrder.indexOf(b.key)
    );

    usageDurationChartData = Object.entries(usageDurationCount).map(
      ([key, count]) => ({
        key,
        data: count,
      })
    );

    // Recomendation Rate
    const totalRecommended = reviews.filter(
      (r) => r.recommendation === true
    ).length;

    recommendationRate =
      totalReviews > 0 ? parseFloat(totalRecommended / totalReviews) * 100 : 0;
    console.log(recommendationRate);

    // Rating
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    // Rating COunt
    reviews.forEach((r) => {
      const rating = r.rating;
      if (rating >= 1 && rating <= 5) {
        ratingCount[rating] += 1;
      }
    });
    ratingChartData = Object.entries(ratingCount).map(([star, count]) => ({
      key: parseInt(star),
      data: count,
    }));
  }

  if (data.response.total_review !== undefined) {
    totalReviews = data.response.total_review;
  }

  if (data.response.price !== undefined) {
    price = data.response.price;
  }

  return (
    <>
      <h3 className="text-gray-500 font-semibold text-xl mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-5 gap-5">
        {/* TODO Image Slider */}
        <div className="relative md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 col-span-full bg-red-100">
          {images.length > 0 && <ImageSlider images={images} />}
        </div>
        <div className="flex flex-wrap justify-between gap-3 col-span-full md:col-start-2 md:col-end-7 md:row-start-1 md:row-end-2">
          <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Star fill="#FACC15" className="text-yellow-500" />
              <Star fill="#FACC15" className="text-yellow-500" />
              <Star fill="#FACC15" className="text-yellow-500" />
              <Star fill="#FACC15" className="text-yellow-500" />
              <StarHalf fill="#FACC15" className="text-yellow-500" />
            </div>
            <dd className="text-gray-500">Average Rating</dd>
            <dt className="mb-2 text-3xl font-bold">4.3/5</dt>
          </div>

          <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
            <dd className="text-gray-500">Recommendation Rate</dd>
            <dt className="mb-2 text-3xl font-bold">
              <Count from={0} to={recommendationRate} duration={2} />%
            </dt>
          </div>

          <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
            <dd className="text-gray-500">Total Review</dd>
            <dt className="mb-2 text-3xl font-bold">
              <Count from={0} to={totalReviews} duration={2} />
            </dt>
          </div>

          <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
            <dd className="text-gray-500">Product Price</dd>
            <dt className="mb-2 text-3xl font-bold">
              {extractCurrencySymbol(price)}
              <Count from={0} to={extractNumber(price)} duration={2} />
            </dt>
          </div>
        </div>

        <div className="col-span-full md:col-start-1 md:col-end-3 md:row-start-2 md:row-end-4 p-5 shadow rounded-lg">
          <HorizBarChartDash
            data={ratingChartData}
            title="Rating Distribution"
            content="rating"
          />
        </div>
        <div className="col-span-full md:col-start-3 md:col-end-5 md:row-start-2 md:row-end-4 p-5 shadow rounded-lg">
          <HorizBarChartDash
            data={usageDurationChartData}
            title="Rating by Used Product"
            content="usedProduct"
          />
        </div>
        <div className="col-span-full md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-6 rounded-lg shadow bg-white p-5">
          <LineChartDash
            data={postedMonthChartData}
            title="Average Rating Period"
            content="ratingPeriod"
          />
        </div>

        <div className="col-span-full md:col-start-3 md:col-end-5 md:row-start-4 md:row-end-6 rounded-lg shadow bg-white p-5">
          <TitleChart>Review List</TitleChart>
          <div className="relative overflow-x-auto overflow-y-auto max-h-[400px] shadow-md sm:rounded-lg w-full">
            <table className="w-full h-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Comment
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Rating
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Recommend
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, idx) => (
                  <tr key={idx} className="bg-white border-b border-gray-100">
                    <th
                      scope="row"
                      className="px-6 py-4 w-auto max-w-[100px] truncate whitespace-nowrap font-medium text-gray-900"
                    >
                      {review.author}
                    </th>
                    <td className="px-6 py-4">{review.title}</td>
                    <td className="px-6 py-4 max-w-sm">
                      {review.body.length > 150 ? (
                        <>
                          {review.body.slice(0, 150)}...
                          <button className="ml-1 text-blue-600 hover:underline text-xs">
                            See more
                          </button>
                        </>
                      ) : (
                        review.body
                      )}
                    </td>
                    <td className="px-6 py-4">{review.rating} ⭐</td>
                    <td className="px-6 py-4">
                      {review.recommendation ? (
                        <span className="text-green-600 font-semibold">✅</span>
                      ) : (
                        <span className="text-red-500 font-semibold">❌</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="py-5">
            <ButtonGeneral
              bgColor="#31be7d"
              dropdown={[
                {
                  text: "This Product Only",
                  onClick: () => exportProductToExcel(data.id),
                },
                {
                  text: "All Product",
                  onClick: () => exportBestBuyToExcel(),
                },
              ]}
            >
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 50 50"
              >
                <path
                  fill="#ffffff"
                  d="M 28.8125 0.03125 L 0.8125 5.34375 C 0.339844 5.433594 0 5.863281 0 6.34375 L 0 43.65625 C 0 44.136719 0.339844 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 28.875 49.980469 28.9375 50 29 50 C 29.230469 50 29.445313 49.929688 29.625 49.78125 C 29.855469 49.589844 30 49.296875 30 49 L 30 1 C 30 0.703125 29.855469 0.410156 29.625 0.21875 C 29.394531 0.0273438 29.105469 -0.0234375 28.8125 0.03125 Z M 32 6 L 32 13 L 34 13 L 34 15 L 32 15 L 32 20 L 34 20 L 34 22 L 32 22 L 32 27 L 34 27 L 34 29 L 32 29 L 32 35 L 34 35 L 34 37 L 32 37 L 32 44 L 47 44 C 48.101563 44 49 43.101563 49 42 L 49 8 C 49 6.898438 48.101563 6 47 6 Z M 36 13 L 44 13 L 44 15 L 36 15 Z M 6.6875 15.6875 L 11.8125 15.6875 L 14.5 21.28125 C 14.710938 21.722656 14.898438 22.265625 15.0625 22.875 L 15.09375 22.875 C 15.199219 22.511719 15.402344 21.941406 15.6875 21.21875 L 18.65625 15.6875 L 23.34375 15.6875 L 17.75 24.9375 L 23.5 34.375 L 18.53125 34.375 L 15.28125 28.28125 C 15.160156 28.054688 15.035156 27.636719 14.90625 27.03125 L 14.875 27.03125 C 14.8125 27.316406 14.664063 27.761719 14.4375 28.34375 L 11.1875 34.375 L 6.1875 34.375 L 12.15625 25.03125 Z M 36 20 L 44 20 L 44 22 L 36 22 Z M 36 27 L 44 27 L 44 29 L 36 29 Z M 36 35 L 44 35 L 44 37 L 36 37 Z"
                ></path>
              </svg>
              Excel Download
            </ButtonGeneral>
            <ButtonGeneral bgColor="#cd4f2e">
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 50 50"
              >
                <path
                  fill="#ffffff"
                  d="M 28 4.0292969 C 21.72 4.3192969 16.159766 7.37 12.509766 12 L 20.800781 12 C 23.120781 12 25 13.879219 25 16.199219 L 25 24 L 28 24 L 28 4.0292969 z M 30 4.0292969 L 30 24 L 49.970703 24 C 49.470703 13.2 40.8 4.5292969 30 4.0292969 z M 3.1992188 14 C 1.9842187 14 1 14.984219 1 16.199219 L 1 33.800781 C 1 35.015781 1.9842187 36 3.1992188 36 L 20.800781 36 C 22.015781 36 23 35.015781 23 33.800781 L 23 16.199219 C 23 14.984219 22.015781 14 20.800781 14 L 3.1992188 14 z M 7.8730469 19 L 13.490234 19 C 15.498234 19 17.126906 20.627766 17.128906 22.634766 L 17.128906 22.705078 C 17.128906 24.961078 15.300922 26.789062 13.044922 26.789062 L 10.306641 26.789062 L 10.306641 31.023438 L 7.8730469 31.023438 L 7.8730469 19 z M 10.306641 20.896484 L 10.306641 24.894531 L 12.699219 24.894531 C 13.732219 24.894531 14.570312 24.056438 14.570312 23.023438 L 14.570312 22.767578 C 14.570312 21.734578 13.732219 20.896484 12.699219 20.896484 L 10.306641 20.896484 z M 25 26 L 25 33.800781 C 25 36.120781 23.120781 38 20.800781 38 L 12.509766 38 C 16.349766 42.87 22.31 46 29 46 C 40.26 46 49.450703 37.14 49.970703 26 L 25 26 z"
                ></path>
              </svg>
              Power Point Download
            </ButtonGeneral>
          </div>
        </div>
        <div className="col-span-full md:col-start-5 md:col-end-7 md:row-start-2 md:row-end-6 px-5 shadow rounded-lg">
          <CardList
            title={
              <>
                <MessageCircleMore className="mr-3" /> Sentimenent
              </>
            }
          >
            <div className="flex flex-col lg:flex-row gap-3">
              <p className="flex ml-2 font-semibold text-lg">
                <Smile className="text-green-500 mr-3" />{" "}
                <Count from={0} to={sentimentSummary.positive} duration={2} />
              </p>
              <p className="flex ml-2 font-semibold text-lg">
                <Meh className="text-yellow-500 mr-3" />
                <Count from={0} to={sentimentSummary.neutral} duration={2} />
              </p>
              <p className="flex ml-2 font-semibold text-lg">
                <Frown className="text-red-500 mr-3" />
                <Count from={0} to={sentimentSummary.negative} duration={2} />
              </p>
            </div>
          </CardList>
          <div className="p-2 rounded flex flex-col mt-5">
            <CardList
              title={
                <>
                  <Check className="mr-2 text-green-500" />
                  Top Pros
                </>
              }
            >
              <ul role="list" className="w-full divide-y divide-gray-200">
                {topPros.map((pros) => (
                  <li className="py-3 sm:py-4 flex justify-between pr-3">
                    <span>{pros.label}</span> <span>{pros.value}</span>
                  </li>
                ))}
              </ul>
            </CardList>

            <CardList
              title={
                <>
                  {" "}
                  <X className="mr-2 text-red-500" />
                  Top Cons
                </>
              }
            >
              <ul role="list" className="w-full divide-y divide-gray-200">
                {topCons.map((cons) => (
                  <li className="py-3 sm:py-4 flex justify-between pr-3">
                    <span>{cons.label}</span> <span>{cons.value}</span>
                  </li>
                ))}
              </ul>
            </CardList>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
