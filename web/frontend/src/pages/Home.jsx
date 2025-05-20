import React from "react";

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../compoenents/fragments/Footer";
import Nav from "../compoenents/fragments/Nav";
import Advantages from "../compoenents/fragments/Advantages";
import Hero from "../compoenents/fragments/Hero";
import Testimoni from "../compoenents/fragments/Testimoni";
import LogoGrid from "../compoenents/elements/LogoGrid";
import {
  featureCore,
  features,
  happyCompany,
  lovedByCompanies,
  support,
} from "../data/data";
import Feature from "../compoenents/fragments/Feature";
import SectionGrid from "../compoenents/fragments/SectionGrid";
import FeatureCardGrid from "../compoenents/elements/FeatureCardGrid";
import SupportCardGrid from "../compoenents/elements/SupportCardGrid";
import VideoSection from "../compoenents/fragments/VideoSection";

export default function Home() {
  return (
    <div className="min-h-scree">
      {/* Navigation */}
      <header className="border-b border-gray-100 bg-[#FFF9F3]">
        <Nav />
        <Hero />
      </header>

      {/* Video Section */}
      <VideoSection />

      {/* Testimonials */}
      <Testimoni />

      {/* Loved By Section */}

      <SectionGrid
        title={
          <>
            <span className="text-red-500">❤</span> Loved by cool people from
          </>
        }
        logos={happyCompany}
        Component={
          <LogoGrid
            logos={lovedByCompanies}
            gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          />
        }
      />

      <Advantages />

      {/* Social Proof Section */}
      <SectionGrid
        title="Join over 100k+ happy users from around the world!"
        logos={happyCompany}
        hoverEffect
        Component={
          <LogoGrid
            logos={happyCompany}
            gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            hoverEffect
          />
        }
      />

      {/* Templates Grid */}
      <SectionGrid
        title={
          <>
            Professional Insights,
            <br />
            Instantly Visualized
          </>
        }
        titleLeft
        logos={happyCompany}
        hoverEffect
        Component={
          <FeatureCardGrid
            cards={featureCore}
            gridCols="grid grid-cols-1 md:grid-cols-3 gap-6"
          />
        }
        addOnBottom={
          <img
            src="/feature/dashboard.png"
            className="w-full h-auto object-cover"
          />
        }
        dark
      />

      {/* Features Section */}
      <Feature
        title="Smarter Insights, Better Decisions."
        desc="Sentiview empowers your business with intelligent sentiment analysis
          from real customer feedback."
        feature={features}
      />

      {/* Pricing Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#f6f6fc]">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#030521]">
            Flexible Plans for Every Need
          </h2>
          <p className="text-[#45426e] mb-8 max-w-2xl mx-auto">
            Get started for free. Choose a plan that fits your business—unlock
            deeper insights, integrations, and exports as you grow.
          </p>

          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-[#3a30ba] text-white px-6 py-3 rounded-md font-medium hover:bg-[#8c3bfc] transition-colors"
          >
            See Pricing →
          </Link>
        </div>
      </section>

      {/* Support Section */}
      <SectionGrid
        title={
          <>
            Extended Guides, Live Support & <br /> Community to help you
          </>
        }
        Component={
          <SupportCardGrid
            cards={support}
            gridCols="grid grid-cols-1 md:grid-cols-3 gap-8"
          />
        }
      />

      <section className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12">
          Turn Reviews into Insights
        </h1>

        <div className="relative">
          {/* Decorative lines */}
          <div className="absolute -left-24 top-1/2 transform -translate-y-1/2">
            <div className="w-20 h-1.5 bg-[#ffcc85] rounded-full mb-2"></div>
            <div className="w-16 h-1.5 bg-[#ffcc85] rounded-full"></div>
          </div>

          <Link
            href="#"
            className="bg-[#3a30ba] hover:bg-[#4a40ca] text-white font-medium py-3 px-8 rounded-md inline-flex items-center transition-colors"
          >
            View Demo <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
