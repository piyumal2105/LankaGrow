import React from "react";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import AIFeatures from "../components/landing/AIFeatures";
import Pricing from "../components/landing/Pricing";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <AIFeatures />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
