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
import { toPng } from "html-to-image";
import download from "downloadjs";
import HorizBarChartDash from "./charts/HorizBarChartDash";
import TitleChart from "../elements/text/TitleChart";
import CardList from "./charts/CardList";
import ImageSlider from "./charts/ImageSlider";
import LineChartDash from "./charts/LineChartDash";
import {
  conversationToPPT,
  exportBestBuyToExcel,
  exportProductToExcel,
  getConversationById,
} from "../../utils/convercation";
import ButtonGeneral from "../elements/ButtonGeneral";
import Rating from "./charts/Rating";
import { downloadUi } from "../../utils/downloadUi";

function Dashboard({ data, id }) {
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

  let ratingChartData = [
    { key: 1, data: 0 },
    { key: 2, data: 0 },
    { key: 3, data: 0 },
    { key: 4, data: 0 },
    { key: 5, data: 0 },
  ];

  let usageDurationChartData = [
    { key: "not used yet", data: 0 },
    { key: "less than 1 month", data: 0 },
    { key: "1 - 6 months", data: 0 },
    { key: "6 - 12 months", data: 0 },
    { key: "more than a year", data: 0 },
  ];

  let postedMonthChartData;

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

    ratingChartData = data.response.analysis?.rating_distribution;
    usageDurationChartData = data.response.analysis?.duration_distribution;
    const monthToIndex = [
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

    const currentYear = new Date().getFullYear();

    postedMonthChartData = (data.response.analysis?.trend_distribution || [])
      .map(({ key, data }) => {
        const monthIndex = monthToIndex.indexOf(key);
        return {
          key: new Date(currentYear, monthIndex, 1),
          data,
        };
      })
      .sort((a, b) => a.key - b.key);
  }

  if (Array.isArray(data.response.reviews)) {
    reviews = data.response.reviews;
    totalReviews = reviews.length;

    // Recomendation Rate
    const totalRecommended = reviews.filter(
      (r) => r.recommendation === true
    ).length;

    recommendationRate =
      totalReviews > 0 ? parseFloat(totalRecommended / totalReviews) * 100 : 0;

    // Rating
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
  }

  if (data.response.total_review !== undefined) {
    totalReviews = data.response.total_review;
  }

  if (data.response.price !== undefined) {
    price = data.response.price;
  }

  const [downloadingDashboard, setDownloadingDashboard] = useState(false);

  const handleDownloadDashboard = async () => {
    setDownloadingDashboard(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await downloadUi(`dashboard-${id}`);
    setDownloadingDashboard(false);
  };

  return (
    <div id={`dashboard-${id}`} style={{ backgroundColor: "#ffffff" }}>
      <h3 className="text-gray-500 text-center font-semibold text-xl lg:text-2xl mt-3 mb-6">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-5 gap-5">
        {/* TODO Image Slider */}
        {/* <div className="relative md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 col-span-full flex items-center justify-center">
          {images.length > 0 && <ImageSlider images={images} />}
        </div> */}

        <div className="flex flex-wrap justify-between gap-3 col-span-full md:col-start-2 md:col-end-7 md:row-start-1 md:row-end-2">
          <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
            <Rating rating={averageRating} />
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
            <ButtonGeneral
              bgColor="#cd4f2e"
              onClick={() => {
                console.log(id, getConversationById("BestBuy", id));
                conversationToPPT(getConversationById("BestBuy", id));
              }}
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
                  d="M 28 4.0292969 C 21.72 4.3192969 16.159766 7.37 12.509766 12 L 20.800781 12 C 23.120781 12 25 13.879219 25 16.199219 L 25 24 L 28 24 L 28 4.0292969 z M 30 4.0292969 L 30 24 L 49.970703 24 C 49.470703 13.2 40.8 4.5292969 30 4.0292969 z M 3.1992188 14 C 1.9842187 14 1 14.984219 1 16.199219 L 1 33.800781 C 1 35.015781 1.9842187 36 3.1992188 36 L 20.800781 36 C 22.015781 36 23 35.015781 23 33.800781 L 23 16.199219 C 23 14.984219 22.015781 14 20.800781 14 L 3.1992188 14 z M 7.8730469 19 L 13.490234 19 C 15.498234 19 17.126906 20.627766 17.128906 22.634766 L 17.128906 22.705078 C 17.128906 24.961078 15.300922 26.789062 13.044922 26.789062 L 10.306641 26.789062 L 10.306641 31.023438 L 7.8730469 31.023438 L 7.8730469 19 z M 10.306641 20.896484 L 10.306641 24.894531 L 12.699219 24.894531 C 13.732219 24.894531 14.570312 24.056438 14.570312 23.023438 L 14.570312 22.767578 C 14.570312 21.734578 13.732219 20.896484 12.699219 20.896484 L 10.306641 20.896484 z M 25 26 L 25 33.800781 C 25 36.120781 23.120781 38 20.800781 38 L 12.509766 38 C 16.349766 42.87 22.31 46 29 46 C 40.26 46 49.450703 37.14 49.970703 26 L 25 26 z"
                ></path>
              </svg>
              Power Point Download
            </ButtonGeneral>
            <ButtonGeneral
              loading
              bgColor="#222222"
              onClick={handleDownloadDashboard}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                width="20"
                height="20"
                fill="white"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h18v4H3V3zm0 6h18v2H3V9zm0 4h18v2H3v-2zm0 4h6v2H3v-2zm8 0h10v2H11v-2zm3-10h2v5h3l-4 4-4-4h3V7z" />
              </svg>

              {downloadingDashboard ? "Loading . . ." : "Dashboard Download"}
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
    </div>
  );
}

export default Dashboard;

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

// function Dashboard({ data, id }) {
//   const title = data.response.title;
//   const images = data.response.images;
//   let recommendationRate = 0;
//   let totalReviews = 0;
//   let price = 0;
//   let averageRating = 0;
//   let topCons = [];
//   let topPros = [];
//   let wordCloud = [];
//   let reviews = [];

//   let sentimentSummary = {
//     negative: 0,
//     neutral: 0,
//     positive: 0,
//   };
//   const ratingCount = {
//     1: 0,
//     2: 0,
//     3: 0,
//     4: 0,
//     5: 0,
//   };

//   let ratingChartData = Object.entries(ratingCount).map(([star, count]) => ({
//     key: parseInt(star),
//     data: count,
//   }));
//   const usageDurationCount = {
//     "not used yet": 0,
//     "less than 1 month": 0,
//     "1 - 6 months": 0,
//     "6 - 12 months": 0,
//     "more than a year": 0,
//   };

//   let usageDurationChartData = Object.entries(usageDurationCount).map(
//     ([key, count]) => ({
//       key,
//       data: count,
//     })
//   );

//   const postedMonthCount = {};

//   let postedMonthChartData = Object.entries(postedMonthCount).map(
//     ([key, count]) => ({
//       key,
//       data: count,
//     })
//   );

//   if (data.response.analysis) {
//     topCons = data.response.analysis?.top_cons.map(([label, value]) => ({
//       label,
//       value,
//     }));
//     topPros = data.response.analysis?.top_pros.map(([label, value]) => ({
//       label,
//       value,
//     }));
//     sentimentSummary = data.response.analysis?.sentiment_summary;
//     wordCloud = data.response.analysis?.word_cloud_data.map(([key, value]) => ({
//       key,
//       data: value,
//     }));
//   }

//   if (Array.isArray(data.response.reviews)) {
//     reviews = data.response.reviews;

//     totalReviews = reviews.length;

//     for (const review of reviews) {
//       const posted = review.review_info?.posted;
//       if (posted && posted.label) {
//         const label = posted.label; // Misal "August"
//         postedMonthCount[label] = (postedMonthCount[label] || 0) + 1;
//       }

//       // Duration Used
//       const used = review.review_info?.used_duration;

//       if (used?.value) {
//         const dur = used.duration || "unknown";
//         usageDurationCount[dur] = (usageDurationCount[dur] || 0) + 1;
//       } else {
//         usageDurationCount["not used yet"] =
//           (usageDurationCount["not used yet"] || 0) + 1;
//       }
//     }
//     const monthOrder = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];

//     postedMonthChartData = Object.entries(postedMonthCount)
//       .map(([label, count]) => {
//         const monthIndex = monthOrder.indexOf(label);
//         return {
//           key: new Date(2025, monthIndex, 1),
//           data: count,
//         };
//       })
//       .sort((a, b) => a.key - b.key);

//     postedMonthChartData.sort(
//       (a, b) => monthOrder.indexOf(a.key) - monthOrder.indexOf(b.key)
//     );

//     usageDurationChartData = Object.entries(usageDurationCount).map(
//       ([key, count]) => ({
//         key,
//         data: count,
//       })
//     );

//     // Recomendation Rate
//     const totalRecommended = reviews.filter(
//       (r) => r.recommendation === true
//     ).length;

//     recommendationRate =
//       totalReviews > 0 ? parseFloat(totalRecommended / totalReviews) * 100 : 0;

//     // Rating
//     const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
//     averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

//     // Rating COunt
//     reviews.forEach((r) => {
//       const rating = r.rating;
//       if (rating >= 1 && rating <= 5) {
//         ratingCount[rating] += 1;
//       }
//     });
//     ratingChartData = Object.entries(ratingCount).map(([star, count]) => ({
//       key: parseInt(star),
//       data: count,
//     }));
//   }

//   if (data.response.total_review !== undefined) {
//     totalReviews = data.response.total_review;
//   }

//   if (data.response.price !== undefined) {
//     price = data.response.price;
//   }

//   const [downloadingDashboard, setDownloadingDashboard] = useState(false);

//   const handleDownloadDashboard = async () => {
//     setDownloadingDashboard(true);
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     await downloadUi(`dashboard-${id}`);
//     setDownloadingDashboard(false);
//   };

//   return (
//     <div id={`dashboard-${id}`} style={{ backgroundColor: "#ffffff" }}>
//       <h3 className="text-gray-500 text-center font-semibold text-xl lg:text-2xl mt-3 mb-6">
//         {title}
//       </h3>
//       <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-5 gap-5">
//         {/* TODO Image Slider */}
//         {/* <div className="relative md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 col-span-full flex items-center justify-center">
//           {images.length > 0 && <ImageSlider images={images} />}
//         </div> */}

//         <div className="flex flex-wrap justify-between gap-3 col-span-full md:col-start-2 md:col-end-7 md:row-start-1 md:row-end-2">
//           <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
//             <Rating rating={averageRating} />
//           </div>

//           <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
//             <dd className="text-gray-500">Recommendation Rate</dd>
//             <dt className="mb-2 text-3xl font-bold">
//               <Count from={0} to={recommendationRate} duration={2} />%
//             </dt>
//           </div>

//           <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
//             <dd className="text-gray-500">Total Review</dd>
//             <dt className="mb-2 text-3xl font-bold">
//               <Count from={0} to={totalReviews} duration={2} />
//             </dt>
//           </div>

//           <div className="w-full md:w-[48%] lg:w-[23%] flex flex-col items-center justify-center rounded-lg shadow bg-white p-4">
//             <dd className="text-gray-500">Product Price</dd>
//             <dt className="mb-2 text-3xl font-bold">
//               {extractCurrencySymbol(price)}
//               <Count from={0} to={extractNumber(price)} duration={2} />
//             </dt>
//           </div>
//         </div>

//         <div className="col-span-full md:col-start-1 md:col-end-3 md:row-start-2 md:row-end-4 p-5 shadow rounded-lg">
//           <HorizBarChartDash
//             data={ratingChartData}
//             title="Rating Distribution"
//             content="rating"
//           />
//         </div>
//         <div className="col-span-full md:col-start-3 md:col-end-5 md:row-start-2 md:row-end-4 p-5 shadow rounded-lg">
//           <HorizBarChartDash
//             data={usageDurationChartData}
//             title="Rating by Used Product"
//             content="usedProduct"
//           />
//         </div>
//         <div className="col-span-full md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-6 rounded-lg shadow bg-white p-5">
//           <LineChartDash
//             data={postedMonthChartData}
//             title="Average Rating Period"
//             content="ratingPeriod"
//           />
//         </div>

//         <div className="col-span-full md:col-start-3 md:col-end-5 md:row-start-4 md:row-end-6 rounded-lg shadow bg-white p-5">
//           <TitleChart>Review List</TitleChart>
//           <div className="relative overflow-x-auto overflow-y-auto max-h-[400px] shadow-md sm:rounded-lg w-full">
//             <table className="w-full h-full text-sm text-left text-gray-500 ">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-100">
//                 <tr>
//                   <th scope="col" className="px-6 py-3">
//                     Name
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Title
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Comment
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Rating
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Recommend
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reviews.map((review, idx) => (
//                   <tr key={idx} className="bg-white border-b border-gray-100">
//                     <th
//                       scope="row"
//                       className="px-6 py-4 w-auto max-w-[100px] truncate whitespace-nowrap font-medium text-gray-900"
//                     >
//                       {review.author}
//                     </th>
//                     <td className="px-6 py-4">{review.title}</td>
//                     <td className="px-6 py-4 max-w-sm">
//                       {review.body.length > 150 ? (
//                         <>
//                           {review.body.slice(0, 150)}...
//                           <button className="ml-1 text-blue-600 hover:underline text-xs">
//                             See more
//                           </button>
//                         </>
//                       ) : (
//                         review.body
//                       )}
//                     </td>
//                     <td className="px-6 py-4">{review.rating} ⭐</td>
//                     <td className="px-6 py-4">
//                       {review.recommendation ? (
//                         <span className="text-green-600 font-semibold">✅</span>
//                       ) : (
//                         <span className="text-red-500 font-semibold">❌</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="py-5">
//             <ButtonGeneral
//               bgColor="#31be7d"
//               dropdown={[
//                 {
//                   text: "This Product Only",
//                   onClick: () => exportProductToExcel(data.id),
//                 },
//                 {
//                   text: "All Product",
//                   onClick: () => exportBestBuyToExcel(),
//                 },
//               ]}
//             >
//               <svg
//                 className="mr-2"
//                 xmlns="http://www.w3.org/2000/svg"
//                 x="0px"
//                 y="0px"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 50 50"
//               >
//                 <path
//                   fill="#ffffff"
//                   d="M 28.8125 0.03125 L 0.8125 5.34375 C 0.339844 5.433594 0 5.863281 0 6.34375 L 0 43.65625 C 0 44.136719 0.339844 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 28.875 49.980469 28.9375 50 29 50 C 29.230469 50 29.445313 49.929688 29.625 49.78125 C 29.855469 49.589844 30 49.296875 30 49 L 30 1 C 30 0.703125 29.855469 0.410156 29.625 0.21875 C 29.394531 0.0273438 29.105469 -0.0234375 28.8125 0.03125 Z M 32 6 L 32 13 L 34 13 L 34 15 L 32 15 L 32 20 L 34 20 L 34 22 L 32 22 L 32 27 L 34 27 L 34 29 L 32 29 L 32 35 L 34 35 L 34 37 L 32 37 L 32 44 L 47 44 C 48.101563 44 49 43.101563 49 42 L 49 8 C 49 6.898438 48.101563 6 47 6 Z M 36 13 L 44 13 L 44 15 L 36 15 Z M 6.6875 15.6875 L 11.8125 15.6875 L 14.5 21.28125 C 14.710938 21.722656 14.898438 22.265625 15.0625 22.875 L 15.09375 22.875 C 15.199219 22.511719 15.402344 21.941406 15.6875 21.21875 L 18.65625 15.6875 L 23.34375 15.6875 L 17.75 24.9375 L 23.5 34.375 L 18.53125 34.375 L 15.28125 28.28125 C 15.160156 28.054688 15.035156 27.636719 14.90625 27.03125 L 14.875 27.03125 C 14.8125 27.316406 14.664063 27.761719 14.4375 28.34375 L 11.1875 34.375 L 6.1875 34.375 L 12.15625 25.03125 Z M 36 20 L 44 20 L 44 22 L 36 22 Z M 36 27 L 44 27 L 44 29 L 36 29 Z M 36 35 L 44 35 L 44 37 L 36 37 Z"
//                 ></path>
//               </svg>
//               Excel Download
//             </ButtonGeneral>
//             <ButtonGeneral
//               bgColor="#cd4f2e"
//               onClick={() =>
//                 conversationToPPT({
//                   id: 24861917,
//                   role: "ai",
//                   response: {
//                     type: "product",
//                     title:
//                       "bella PRO - 4-qt. TriZone Touchscreen Air Fryer with Dual Flex Basket - Stainless Steel",
//                     price: "$39.99",
//                     product_url:
//                       "https://www.bestbuy.com/site/bella-pro-4-qt-trizone-touchscreen-air-fryer-with-dual-flex-basket-stainless-steel/6583879.p?skuId=6583879&intl=nosplash",
//                     review_url:
//                       "https://www.bestbuy.com/site/reviews/bella-pro-4-qt-trizone-touchscreen-air-fryer-with-dual-flex-basket-stainless-steel/6583879",
//                     images: [
//                       "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/9b097944-fdf1-43bf-a7aa-35421f78caa5.jpg;maxHeight=128;maxWidth=64?format=webp",
//                       "https://pisces.bbystatic.com/prescaled/180/320/image2/BestBuy_US/images/videos/duohpcfkjc6x1hzjq3nr.jpg;maxHeight=128;maxWidth=64?format=webp",
//                       "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/9b097944-fdf1-43bf-a7aa-35421f78caa5.jpg;maxHeight=128;maxWidth=64?format=webp",
//                     ],
//                     total_review: 333,
//                     reviews: [
//                       {
//                         author: "FelipeM",
//                         body: "The Bella Pro 4-Qt. TriZone Touchscreen Air Fryer with Dual Flex Basket in Stainless Steel is a fantastic addition to any kitchen. Combining modern design with versatile functionality, this air fryer is perfect for those looking to enjoy healthier meals without sacrificing flavor or convenience.\n\nThe standout feature is the Dual Flex Basket, which allows you to cook two different dishes simultaneously. Whether you’re preparing crispy fries and chicken wings or roasted veggies and fish, the divided basket makes multitasking in the kitchen a breeze. Alternatively, you can remove the divider to use the full 4-quart capacity for larger portions.\n\nThe intuitive touchscreen interface is user-friendly, with preset cooking modes that simplify meal preparation. The stainless steel finish gives it a sleek and durable look, blending seamlessly with most kitchen decor.\n\nPerformance-wise, the TriZone Air Fryer delivers consistent results. The powerful heating system ensures even cooking, while the adjustable temperature and timer provide precise control. Cleanup is also a breeze, thanks to the non-stick, dishwasher-safe basket.\n\nWhile the 4-quart capacity is ideal for small to medium households, it might not be sufficient for larger families or gatherings. Additionally, the touchscreen can be sensitive to smudges, but this is a minor trade-off for its overall convenience.\n\nOverall, the Bella Pro 4-Qt. TriZone Air Fryer is a great choice for anyone seeking a versatile and stylish appliance to elevate their cooking game. Its dual-basket functionality and efficient performance make it a standout option in its class.",
//                         images: [
//                           "https://pisces.bbystatic.com/image2/BestBuy_US/ugc/photos/thumbnail/dc2d138eb5d9c5ea94283d0749978e18.jpg;maxHeight=140;maxWidth=140?format=webp",
//                         ],
//                         rating: 5,
//                         recommendation: true,
//                         title: "Compact, Versatile, and Efficient",
//                       },

//                       {
//                         author: "StanMDENVERCOLORADO",
//                         body: "I PURCHASED A INSIGNIA 70\" FLAT SCREEN NOVEMBER 1, 2024. WAS HAPPY, ORDERED ANOTHER NOVEMBER 21, 2024.\nSECOND TV IS DEFECTIVE, DID I GET ANY HELP, NOT A CHANCE. TOTAL FOR BOTH $1,266.59. I'M OUT $511.39. GREAT JOB BEST BUY.  WHERE DO I GO FROM HERE?",
//                         images: [],
//                         rating: 1,
//                         recommendation: false,
//                         title:
//                           "BEST BUY IS THE WORST AT CUSTOMER SERVICE EVER.",
//                       },
//                     ],
//                     analysis: {
//                       sentiment_summary: {
//                         negative: 15,
//                         neutral: 24,
//                         positive: 294,
//                       },
//                       top_cons: [
//                         ["baskets divided", 1],
//                         ["divided huge", 1],
//                         ["huge cook", 1],
//                         ["cook decent", 1],
//                         ["decent size", 1],
//                         ["size meal", 1],
//                         ["meal problem", 1],
//                         ["extremely disappointed", 1],
//                         ["disappointed lack", 1],
//                         ["lack support", 1],
//                       ],
//                       top_pros: [
//                         ["air fryer", 98],
//                         ["easy clean", 27],
//                         ["works great", 23],
//                         ["easy use", 21],
//                         ["love air", 16],
//                         ["bella pro", 15],
//                         ["air fryers", 11],
//                         ["great product", 11],
//                         ["best buy", 10],
//                         ["perfect size", 9],
//                       ],
//                       word_cloud_data: [
//                         ["air", 220],
//                         ["fryer", 194],
//                         ["use", 108],
//                         ["easy", 107],
//                         ["great", 106],
//                         ["one", 103],
//                         ["love", 95],
//                         ["cook", 86],
//                         ["cooking", 80],
//                         ["time", 70],
//                         ["good", 68],
//                         ["basket", 61],
//                         ["two", 56],
//                         ["food", 56],
//                         ["like", 54],
//                         ["dual", 53],
//                         ["bella", 52],
//                         ["works", 52],
//                         ["divider", 49],
//                         ["different", 46],
//                         ["small", 45],
//                         ["clean", 45],
//                         ["size", 41],
//                         ["well", 41],
//                         ["using", 37],
//                         ["price", 36],
//                         ["would", 35],
//                         ["perfect", 34],
//                         ["really", 33],
//                         ["much", 32],
//                       ],
//                     },
//                   },
//                 })
//               }
//             >
//               <svg
//                 className="mr-2"
//                 xmlns="http://www.w3.org/2000/svg"
//                 x="0px"
//                 y="0px"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 50 50"
//               >
//                 <path
//                   fill="#ffffff"
//                   d="M 28 4.0292969 C 21.72 4.3192969 16.159766 7.37 12.509766 12 L 20.800781 12 C 23.120781 12 25 13.879219 25 16.199219 L 25 24 L 28 24 L 28 4.0292969 z M 30 4.0292969 L 30 24 L 49.970703 24 C 49.470703 13.2 40.8 4.5292969 30 4.0292969 z M 3.1992188 14 C 1.9842187 14 1 14.984219 1 16.199219 L 1 33.800781 C 1 35.015781 1.9842187 36 3.1992188 36 L 20.800781 36 C 22.015781 36 23 35.015781 23 33.800781 L 23 16.199219 C 23 14.984219 22.015781 14 20.800781 14 L 3.1992188 14 z M 7.8730469 19 L 13.490234 19 C 15.498234 19 17.126906 20.627766 17.128906 22.634766 L 17.128906 22.705078 C 17.128906 24.961078 15.300922 26.789062 13.044922 26.789062 L 10.306641 26.789062 L 10.306641 31.023438 L 7.8730469 31.023438 L 7.8730469 19 z M 10.306641 20.896484 L 10.306641 24.894531 L 12.699219 24.894531 C 13.732219 24.894531 14.570312 24.056438 14.570312 23.023438 L 14.570312 22.767578 C 14.570312 21.734578 13.732219 20.896484 12.699219 20.896484 L 10.306641 20.896484 z M 25 26 L 25 33.800781 C 25 36.120781 23.120781 38 20.800781 38 L 12.509766 38 C 16.349766 42.87 22.31 46 29 46 C 40.26 46 49.450703 37.14 49.970703 26 L 25 26 z"
//                 ></path>
//               </svg>
//               Power Point Download
//             </ButtonGeneral>
//             <ButtonGeneral
//               loading
//               bgColor="#222222"
//               onClick={handleDownloadDashboard}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="mr-2"
//                 width="20"
//                 height="20"
//                 fill="white"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M3 3h18v4H3V3zm0 6h18v2H3V9zm0 4h18v2H3v-2zm0 4h6v2H3v-2zm8 0h10v2H11v-2zm3-10h2v5h3l-4 4-4-4h3V7z" />
//               </svg>

//               {downloadingDashboard ? "Loading . . ." : "Dashboard Download"}
//             </ButtonGeneral>
//           </div>
//         </div>
//         <div className="col-span-full md:col-start-5 md:col-end-7 md:row-start-2 md:row-end-6 px-5 shadow rounded-lg">
//           <CardList
//             title={
//               <>
//                 <MessageCircleMore className="mr-3" /> Sentimenent
//               </>
//             }
//           >
//             <div className="flex flex-col lg:flex-row gap-3">
//               <p className="flex ml-2 font-semibold text-lg">
//                 <Smile className="text-green-500 mr-3" />{" "}
//                 <Count from={0} to={sentimentSummary.positive} duration={2} />
//               </p>
//               <p className="flex ml-2 font-semibold text-lg">
//                 <Meh className="text-yellow-500 mr-3" />
//                 <Count from={0} to={sentimentSummary.neutral} duration={2} />
//               </p>
//               <p className="flex ml-2 font-semibold text-lg">
//                 <Frown className="text-red-500 mr-3" />
//                 <Count from={0} to={sentimentSummary.negative} duration={2} />
//               </p>
//             </div>
//           </CardList>
//           <div className="p-2 rounded flex flex-col mt-5">
//             <CardList
//               title={
//                 <>
//                   <Check className="mr-2 text-green-500" />
//                   Top Pros
//                 </>
//               }
//             >
//               <ul role="list" className="w-full divide-y divide-gray-200">
//                 {topPros.map((pros) => (
//                   <li className="py-3 sm:py-4 flex justify-between pr-3">
//                     <span>{pros.label}</span> <span>{pros.value}</span>
//                   </li>
//                 ))}
//               </ul>
//             </CardList>

//             <CardList
//               title={
//                 <>
//                   {" "}
//                   <X className="mr-2 text-red-500" />
//                   Top Cons
//                 </>
//               }
//             >
//               <ul role="list" className="w-full divide-y divide-gray-200">
//                 {topCons.map((cons) => (
//                   <li className="py-3 sm:py-4 flex justify-between pr-3">
//                     <span>{cons.label}</span> <span>{cons.value}</span>
//                   </li>
//                 ))}
//               </ul>
//             </CardList>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
