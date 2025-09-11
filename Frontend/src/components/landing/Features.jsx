import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Smartphone,
  Globe,
  Shield,
  Clock,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: Package,
      title: "Smart Inventory Management",
      description:
        "Real-time stock tracking with AI-powered reorder suggestions and barcode scanning.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Customer Intelligence",
      description:
        "Advanced CRM with AI insights on customer behavior and purchase patterns.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FileText,
      title: "Intelligent Invoicing",
      description:
        "Automated invoice generation with AI-powered payment reminders and follow-ups.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: DollarSign,
      title: "Expense Automation",
      description:
        "AI categorization of expenses from receipts with tax optimization suggestions.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description:
        "Sales forecasting and business insights powered by machine learning.",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Voice commands in Sinhala/Tamil/English with offline capabilities.",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Globe,
      title: "Local Market Focus",
      description:
        "Built specifically for Sri Lankan businesses with local compliance.",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade security with encrypted data and secure cloud storage.",
      color: "from-gray-500 to-gray-600",
    },
    {
      icon: Clock,
      title: "24/7 AI Assistant",
      description:
        "Round-the-clock AI support for business questions and insights.",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
          >
            Everything Your Business Needs,
            <span className="text-gradient"> Enhanced by AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Traditional business management tools powered by cutting-edge
            artificial intelligence to help your Sri Lankan SME grow faster and
            smarter.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 h-full">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-8">
            Ready to experience the future of business management?
          </p>
          <button className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
