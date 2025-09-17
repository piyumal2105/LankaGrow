// src/components/landing/AIFeatures.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Package,
  DollarSign,
  BarChart3,
  Zap,
  Eye,
  Target,
} from "lucide-react";

const AIFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart Sales Forecasting",
      description:
        "AI predicts next month's sales based on historical data, seasonal trends, and local Sri Lankan market patterns.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      highlight: "95% Accuracy",
    },
    {
      icon: Package,
      title: "Inventory Optimization AI",
      description:
        "Get AI-powered optimal stock level suggestions to minimize waste and maximize profit for your business.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      highlight: "30% Cost Savings",
    },
    {
      icon: DollarSign,
      title: "Price Optimization Engine",
      description:
        "Recommends competitive pricing based on local market analysis and competitor tracking in Sri Lanka.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      highlight: "15% Revenue Boost",
    },
    {
      icon: BarChart3,
      title: "Automated Expense Categorization",
      description:
        "AI instantly categorizes your expenses with 90+ categories, saving hours of manual data entry.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      highlight: "8 Hours Saved/Week",
    },
    {
      icon: TrendingUp,
      title: "Predictive Cash Flow Analysis",
      description:
        "Forecast your cash flow 3-6 months ahead with AI-powered predictions and early warning alerts.",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      highlight: "Early Warnings",
    },
    {
      icon: Eye,
      title: "Business Intelligence Insights",
      description:
        "Get personalized AI insights about your business performance with actionable recommendations.",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      highlight: "Daily Insights",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            AI-Powered Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionary{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              AI Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The first Sri Lankan business platform that thinks ahead for you.
            Powered by advanced AI to help your business grow strategically.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="group">
              <div
                className={`relative p-8 rounded-2xl border border-gray-200 ${feature.bgColor} hover:shadow-xl transition-all duration-300 h-full`}
              >
                {/* Highlight Badge */}
                <div className="absolute -top-3 right-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${feature.color} shadow-lg`}
                  >
                    {feature.highlight}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-white/10 group-hover:to-transparent rounded-2xl transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Experience AI-Powered Business Growth?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of Sri Lankan businesses already using LankaGrow's
              AI features to increase revenue by 15% on average.
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              <Target className="w-5 h-5" />
              Start Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIFeatures;
