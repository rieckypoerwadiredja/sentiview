import {
  ArrowRight,
  Brain,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock,
  CreditCard,
  FileDown,
  FileInput,
  FileText,
  ImageIcon,
  Layers,
  LayoutGrid,
  LinkIcon,
  Lock,
  MessageSquare,
  MousePointerClick,
  PackageSearch,
  PanelLeft,
  Search,
  Settings,
  Tag,
  Zap,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Advantages() {
  return (
    <section className="sm:px-6 lg:px-8">
      {/* Transform Your Ideas into Reality with AI Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#FFF9F3]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#030521] leading-tight">
              Turn Customer Reviews into Business Insights with AI
            </h1>
            <p className="mt-4 text-[#a2a1b7] text-lg">
              Unlock the real voice of your customers with AI-powered sentiment
              analysis. Get beyond the stars—see what people really feel.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Analyze thousands of reviews instantly
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Reveal customer pain points & highlights
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Built for product & competitor evaluation
                </span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-[#3a30ba] text-white px-6 py-3 rounded-md font-medium hover:bg-[#8c3bfc] transition-colors"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="bg-[#f6f6fc] p-4 rounded-lg">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/feature/1.png"
                  alt="Coffee shop website example"
                  width={500}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid 1 */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-[#FFF9F3]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Sentiment-Powered Analysis
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Automatically detect positive, negative, or neutral tone in
              customer feedback
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <Search className="h-5 w-5 text-[#a2a1b7]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Competitor Comparison
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Benchmark your product reviews against industry rivals with
              real-time data.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Fast, Smart, Scalable
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Analyze thousands of reviews in minutes—no more manual reading.
            </p>
          </div>
        </div>
      </section>

      {/* No-Code Website Builder Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#DE238E]/7">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#030521] leading-tight">
              No-Code Dashboard for Review Insights
            </h2>
            <p className="mt-4 text-[#a2a1b7] text-lg">
              Track trends and customer sentiment in a visual way—no code
              needed. Simple, fast, and business-friendly.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Use pre-built dashboard with auto-updated charts
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Track sentiment distribution by product or time
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Designed for business & research needs
                </span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                title="Coming Soon"
                href="#"
                className="inline-flex items-center gap-2 bg-[#b5b3f3] text-white px-6 py-3 rounded-md font-medium cursor-not-allowed opacity-70"
              >
                See Dashboard
                <Lock className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/feature/2.png"
              alt="Website builder interface"
              width={500}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Grid 2 */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-[#DE238E]/7">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <LayoutGrid className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Visual Dashboard
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Interactive graphs and keyword clouds made for quick decisions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <ChartNoAxesCombined className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Trend Detection
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Find what customers talk about most—before your competitors do.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <Brain className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Smart Export Options
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Download visuals or data as reports in one click.
            </p>
          </div>
        </div>
      </section>

      {/* White-Label CMS Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#030521] leading-tight">
              Insight Reports for Research & Business Strategy
            </h2>
            <p className="mt-4 text-[#a2a1b7] text-lg">
              Sentiview helps you generate insight reports tailored for product
              analysis, marketing, or academic research.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Built for business owners, researchers, and product teams
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Export insights in PDF or Excel
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Combine qualitative & quantitative perspectives
                </span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-[#3a30ba] text-white px-6 py-3 rounded-md font-medium hover:bg-[#8c3bfc] transition-colors"
              >
                Generate Insight Report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/feature/3.png"
              alt="White-label CMS dashboard"
              width={500}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Grid 3 */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-[#f6f6fc] p-6 rounded-lg">
            <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center mb-4">
              <FileText className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Insight Report Generator
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Automatically generate reports with charts and key findings.
            </p>
          </div>
          <div className="bg-[#f6f6fc] p-6 rounded-lg">
            <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center mb-4">
              <PackageSearch className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Product & Brand Focus
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Analyze sentiment per brand, variant, or competitor.
            </p>
          </div>
          <div className="bg-[#f6f6fc] p-6 rounded-lg">
            <div className="h-10 w-10 bg-white rounded-md flex items-center justify-center mb-4">
              <FileDown className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Downloadable Results
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Export your insight in formats ready for reports or presentations.
            </p>
          </div>
        </div>
      </section>

      {/* Airtable Integration Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#eeebfa]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#030521] leading-tight">
              Import Reviews from Any Source
            </h2>
            <p className="mt-4 text-[#a2a1b7] text-lg">
              Connect with your review data—Tokopedia, Shopee, or internal
              files. No messy formatting, just clean analysis.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Import .csv, .xlsx, or APIs
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Instantly analyze with NLP
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#3a30ba] mt-0.5 flex-shrink-0" />
                <span className="text-[#030521]">
                  Automated data extraction without messy formatting
                </span>
              </div>
            </div>
            <div className="mt-8">
              <Link
                href="#"
                className="inline-flex items-center gap-2 bg-[#3a30ba] text-white px-6 py-3 rounded-md font-medium hover:bg-[#8c3bfc] transition-colors"
              >
                Start With Your Data
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/feature/4.png"
              alt="Airtable integration"
              width={500}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Grid 4 */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-[#eeebfa]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <FileInput className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Flexible Data Input
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Works with e-commerce platforms or your own spreadsheets.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <Tag className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Auto Sentiment Tagging
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Smart NLP classifies every comment.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="h-10 w-10 bg-[#eef2ff] rounded-md flex items-center justify-center mb-4">
              <LinkIcon className="h-5 w-5 text-[#3a30ba]" />
            </div>
            <h3 className="text-lg font-semibold text-[#030521]">
              Import Reviews via Product Links
            </h3>
            <p className="mt-2 text-[#a2a1b7]">
              Support links from popular e-commerce sites
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Advantages;
