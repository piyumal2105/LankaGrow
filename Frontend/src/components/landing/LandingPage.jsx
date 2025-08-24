import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Brain,
  TrendingUp,
  Shield,
  Globe,
  Users,
  Package,
  FileText,
  BarChart,
  Zap,
  Star,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Package,
      title: "Smart Inventory Management",
      description:
        "AI-powered stock tracking with predictive reorder suggestions and barcode scanning.",
      color: "bg-blue-500",
    },
    {
      icon: Brain,
      title: "AI Business Intelligence",
      description:
        "Advanced analytics and forecasting to predict sales and optimize your business.",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      title: "Professional Invoicing",
      description:
        "Create stunning invoices with automated follow-ups and payment tracking.",
      color: "bg-green-500",
    },
    {
      icon: Users,
      title: "Customer Insights",
      description:
        "Deep customer analytics to identify your best customers and growth opportunities.",
      color: "bg-orange-500",
    },
    {
      icon: BarChart,
      title: "Financial Reports",
      description:
        "Comprehensive P&L reports with visual dashboards and export capabilities.",
      color: "bg-red-500",
    },
    {
      icon: Globe,
      title: "Sri Lankan Focused",
      description:
        "Built specifically for Sri Lankan businesses with local tax compliance and multi-language support.",
      color: "bg-indigo-500",
    },
  ];

  const pricingPlans = [
    {
      name: "Smart Start",
      price: "LKR 750",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "Basic inventory management",
        "Invoice creation",
        "Customer management",
        "Basic AI insights",
        "Mobile app access",
        "Email support",
      ],
      color: "border-gray-200",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
    },
    {
      name: "Business Pro",
      price: "LKR 2,000",
      period: "/month",
      description: "Advanced features for growing businesses",
      features: [
        "Everything in Smart Start",
        "Advanced AI analytics",
        "Multi-user access",
        "Financial reporting",
        "API integrations",
        "Priority support",
      ],
      color: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true,
    },
    {
      name: "Growth Master",
      price: "LKR 4,000",
      period: "/month",
      description: "Enterprise-grade solution for scaling businesses",
      features: [
        "Everything in Business Pro",
        "Custom AI models",
        "Unlimited users",
        "Advanced integrations",
        "Dedicated support",
        "Custom features",
      ],
      color: "border-purple-500",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const testimonials = [
    {
      name: "Priya Perera",
      business: "Fashion Boutique, Colombo",
      content:
        "LankaGrow transformed my business! The AI predictions helped me increase sales by 30% in just 3 months.",
      rating: 5,
    },
    {
      name: "Rohan Silva",
      business: "Electronics Store, Kandy",
      content:
        "The inventory management is incredible. No more stockouts or overstocking. My profits improved significantly.",
      rating: 5,
    },
    {
      name: "Anjali Fernando",
      business: "Restaurant Chain, Galle",
      content:
        "The Sri Lankan tax compliance features saved me hours every month. Best business investment I made.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LG</span>
              </div>
              <span
                className={`ml-3 text-xl font-bold ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                LankaGrow
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
              >
                Features
              </a>
              <a
                href="#pricing"
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
              >
                Reviews
              </a>
              <Link
                to="/login"
                className={`hover:text-blue-600 transition-colors ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#features"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  Reviews
                </a>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Where Sri Lankan Business
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Meets Artificial Intelligence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Revolutionary AI-powered business management platform designed
              specifically for Sri Lankan SMEs. Grow strategically with
              predictive intelligence and automated workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Watch Demo
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">1500+</div>
                <div className="text-blue-100">Happy Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">85%</div>
                <div className="text-blue-100">AI Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">15%</div>
                <div className="text-blue-100">Average Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage, grow, and scale your business with
              the power of AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Brain size={40} className="text-yellow-400 mr-4" />
                <h2 className="text-4xl font-bold">AI That Actually Works</h2>
              </div>
              <p className="text-xl text-blue-100 mb-8">
                Our AI doesn't just process data – it understands Sri Lankan
                business patterns, seasonal trends, and local market dynamics to
                give you actionable insights.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-400 mr-3" />
                  <span>Predicts sales with 85%+ accuracy</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-400 mr-3" />
                  <span>Automatically categorizes expenses</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-400 mr-3" />
                  <span>Optimizes inventory levels</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-400 mr-3" />
                  <span>Identifies growth opportunities</span>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">
                Live AI Dashboard Preview
              </h3>
              <div className="space-y-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>Next Month Sales Prediction</span>
                    <span className="font-bold">LKR 125,000</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
                    <div className="bg-green-400 h-2 rounded-full w-4/5"></div>
                  </div>
                  <p className="text-sm text-blue-100 mt-1">
                    87% confidence level
                  </p>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>Inventory Optimization</span>
                    <span className="text-yellow-400">
                      3 items need reorder
                    </span>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>Customer Insights</span>
                    <span className="text-green-400">
                      5 high-value customers identified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Growth Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible pricing designed for Sri Lankan businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl border-2 ${
                  plan.color
                } p-8 ${plan.popular ? "shadow-2xl scale-105" : "shadow-lg"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`w-full ${plan.buttonColor} text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Sri Lankan Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about their growth journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonial.business}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join over 1,500 Sri Lankan businesses already growing with
            LankaGrow's AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Start Your Free Trial
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">LG</span>
                </div>
                <span className="ml-2 text-lg font-bold">LankaGrow</span>
              </div>
              <p className="text-gray-400">
                AI-powered business management platform for Sri Lankan SMEs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 LankaGrow. All rights reserved. Made with ❤️ in Sri
              Lanka.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
