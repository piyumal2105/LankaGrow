import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  TrendingUp,
  Target,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

function AIFeatures() {
  const aiFeatures = [
    {
      icon: Brain,
      title: "Predictive Sales Forecasting",
      description:
        "AI analyzes your sales patterns, seasonal trends, and local market data to predict future revenue with 85% accuracy.",
      stats: "85% Accuracy",
      color: "from-blue-600 to-purple-600",
      delay: 0,
    },
    {
      icon: Zap,
      title: "Smart Automation Engine",
      description:
        "Automatically categorize expenses, generate reorder suggestions, and send intelligent payment reminders.",
      stats: "8hrs Saved/Week",
      color: "from-yellow-500 to-orange-500",
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      title: "Market Intelligence",
      description:
        "Real-time competitor analysis and Sri Lankan market trends to keep you ahead of the competition.",
      stats: "Real-time Updates",
      color: "from-green-500 to-teal-500",
      delay: 0.4,
    },
    {
      icon: Target,
      title: "Customer Behavior AI",
      description:
        "Identify your best customers, predict purchase patterns, and get personalized marketing suggestions.",
      stats: "95% Customer Insights",
      color: "from-pink-500 to-red-500",
      delay: 0.6,
    },
    {
      icon: MessageSquare,
      title: "Voice Command Interface",
      description:
        "Control your business operations using voice commands in Sinhala, Tamil, or English.",
      stats: "3 Languages",
      color: "from-indigo-500 to-blue-600",
      delay: 0.8,
    },
    {
      icon: Lightbulb,
      title: "Business Growth Advisor",
      description:
        "Get AI-powered recommendations for improving profitability, reducing costs, and scaling operations.",
      stats: "15% Avg Growth",
      color: "from-purple-600 to-pink-600",
      delay: 1.0,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6"
          >
            <Brain className="w-5 h-5" />
            <span className="font-semibold">
              Powered by Artificial Intelligence
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6"
          >
            The AI That Works for
            <span className="block text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Success
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Our AI doesn't just automate tasks—it thinks strategically about
            your business, learning from Sri Lankan market patterns to give you
            intelligent insights.
          </motion.p>
        </div>

        {/* AI Features grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-strong transition-all duration-500 border border-gray-100 relative overflow-hidden">
                {/* Background gradient */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`}
                ></div>

                {/* Icon and stats */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} p-3.5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-semibold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                    >
                      {feature.stats}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-24"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white opacity-5 rounded-full translate-y-32"></div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Let AI Transform Your Business?
            </h3>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join hundreds of Sri Lankan businesses already using AI to grow
              faster, make smarter decisions, and stay ahead of the competition.
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
              Start Your AI Journey Today
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AIFeatures;
