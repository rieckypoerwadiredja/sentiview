import React from "react";

import {
  BarChart2,
  Clock,
  Download,
  Filter,
  Layout,
  Search,
  Smile,
  TrendingUp,
  Users,
} from "lucide-react";

const lovedByCompanies = [
  {
    src: "/logo/company/example.png",
    alt: "Flippa",
    width: 140,
    height: 40,
    className: "h-10 w-auto object-contain",
  },
  {
    src: "/logo/company/example.png",
    alt: "Binus",
    width: 140,
    height: 40,
    className: "h-10 w-auto object-contain",
  },
  {
    src: "/logo/company/example.png",
    alt: "Decathlon",
    width: 140,
    height: 40,
    className: "h-10 w-auto object-contain",
  },
  {
    src: "/logo/company/example.png",
    alt: "hacktiv8",
    width: 140,
    height: 40,
    className: "h-10 w-auto object-contain",
  },
  {
    src: "/logo/company/example.png",
    alt: "indofood",
    width: 140,
    height: 40,
    className: "h-8 w-auto object-contain",
  },
  {
    src: "/logo/company/example.png",
    alt: "xendit",
    width: 140,
    height: 40,
    className: "h-10 w-auto object-contain",
  },
];

const happyCompany = [
  {
    src: "/logo/company/example.png",
    alt: "Ruang Guru",
    width: 120,
    height: 40,
  },
  {
    src: "/logo/company/example.png",
    alt: "Kopi Kenangan",
    width: 120,
    height: 40,
  },
  {
    src: "/logo/company/example.png",
    alt: "Niessen",
    width: 120,
    height: 40,
  },
  {
    src: "/logo/company/example.png",
    alt: "Chatime",
    width: 120,
    height: 40,
  },
  {
    src: "/logo/company/example.png",
    alt: "Bukalapak",
    width: 120,
    height: 50,
  },
  {
    src: "/logo/company/example.png",
    alt: "Tokopedia",
    width: 120,
    height: 40,
  },
];

const features = [
  {
    element: <Search className="w-6 h-6 text-[#8c3bfc]" />,
    title: "Automated Review Collection",
    description:
      "Sentiview scrapes and aggregates customer reviews from e-commerce platforms—no manual work required.",
    iconBg: "bg-[#eef2ff]",
  },
  {
    element: <Smile className="w-6 h-6 text-[#27a6fe]" />,
    title: "Sentiment Classification",
    description:
      "Identify positive, negative, and neutral comments using NLP-powered sentiment detection.",
    iconBg: "bg-[#eef2ff]",
  },
  {
    element: <BarChart2 className="w-6 h-6 text-[#de238e]" />,
    title: "Visual Performance Insights",
    description:
      "Turn unstructured text into visual charts to evaluate product and competitor performance.",
    iconBg: "bg-[#fff9f3]",
  },
  {
    element: <Filter className="w-6 h-6 text-[#8c3bfc]" />,
    title: "Noise Reduction",
    description:
      "Filter out irrelevant reviews, like complaints about shipping or delivery, to focus on product-specific insights.",
    iconBg: "bg-[#eef2ff]",
  },
  {
    element: <TrendingUp className="w-6 h-6 text-[#f0cd0a]" />,
    title: "Trend Detection",
    description:
      "Spot emerging customer preferences such as flavor trends or quality mentions before competitors do.",
    iconBg: "bg-[#fff2b5]",
  },
  {
    element: <Layout className="w-6 h-6 text-[#de238e]" />,
    title: "Structured Sentiment Mapping",
    description:
      "Organize customer feedback into clear categories to identify product strengths and weaknesses.",
    iconBg: "bg-[#fff9f3]",
  },
  {
    element: <Download className="w-6 h-6 text-[#8c3bfc]" />,
    title: "Data Export Support",
    description:
      "Export analysis results in .pkl or .json format—ready for Python or TensorFlow.js applications.",
    iconBg: "bg-[#eef2ff]",
  },
  {
    element: <Users className="w-6 h-6 text-[#33b17e]" />,
    title: "Competitor Benchmarking",
    description:
      "Compare sentiment data across competitor products to sharpen your unique value proposition.",
    iconBg: "bg-[#eef2ff]",
  },
  {
    element: <Clock className="w-6 h-6 text-[#27a6fe]" />,
    title: "Time-saving Automation",
    description:
      "Eliminate manual review reading and save hours while uncovering actionable insights instantly.",
    iconBg: "bg-[#eef2ff]",
  },
];

const featureCore = [
  {
    element: null,
    title: "Auto Dashboards",
    description: "No-code dashboards for instant sentiment insights.",
    classCard: "bg-[#17134a]",
    dark: true,
  },
  {
    element: null,
    title: "Smart Reports",
    description:
      "Rebuilt layouts for product, competitor, or marketing reports.",
    classCard: "bg-[#17134a]",
    dark: true,
  },
  {
    element: null,
    title: "Interactive Elements",
    description: "Keyword clouds, trend graphs, sentiment charts & more.",
    classCard: "bg-[#17134a]",
    dark: true,
  },
];
const support = [
  {
    title: "Documentation",
    description:
      "Learn how to upload your review data, interpret dashboards, and generate insight reports. Our detailed docs help you get started fast.",
    buttonText: "View Docs →",
  },
  {
    title: "Insight Support",
    description:
      "Need help understanding results or configuring your analysis? Chat with our support team or send us a message—we’ll assist you promptly.",
    buttonText: "Get Support →",
  },
  {
    title: "Community & Forum",
    description:
      "Join discussions with other business owners and researchers. Share tips, get feedback, and explore use cases together.",
    buttonText: "Join the Community →",
  },
];

const featuredOn = [
  {
    src: "/logo/company/bestbuy.jpg",
    alt: "Bestbuy",
    width: 150,
    height: 80,
    className: "h-10 w-auto object-cover",
    status: "active", // Satu-satunya yang aktif
  },
  {
    src: "/logo/company/youtube.png",
    alt: "YouTube",
    width: 80,
    height: 40,
    className: "h-8 w-auto object-contain",
    status: "soon",
  },
  {
    src: "/logo/company/walmart.png",
    alt: "Walmart",
    width: 80,
    height: 80,
    className: "h-14 w-auto object-contain",
    status: "soon",
  },
  {
    src: "/logo/company/HubSport.png",
    alt: "HubSpot",
    width: 100,
    height: 40,
    className: "h-8 w-auto object-contain",
    status: "soon",
  },
  {
    src: "/logo/company/tokopedia.png",
    alt: "Tokopedia",
    width: 120,
    height: 40,
    className: "h-8 w-auto object-contain",
    status: "soon",
  },
];

export {
  lovedByCompanies,
  happyCompany,
  features,
  featureCore,
  support,
  featuredOn,
};
