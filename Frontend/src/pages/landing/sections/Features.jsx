import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Smartphone,
  BarChart3,
  Users,
  Receipt,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";

const Features = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Business Intelligence",
      description:
        "Smart sales forecasting, inventory optimization, and customer insights powered by advanced machine learning.",
      color: "from-primary-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description:
        "Forecast your business performance with 85%+ accuracy using historical data and local market patterns.",
      color: "from-accent-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description:
        "Automated invoice follow-ups, expense categorization, and reorder suggestions save hours daily.",
      color: "from-success-500 to-emerald-600",
    },
    {
      icon: Globe,
      title: "Local Market Intelligence",
      description:
        "Sri Lankan economic indicators, competitor pricing, and seasonal trends specific to your business.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Voice commands in Sinhala/Tamil/English, offline mode, and WhatsApp integration for modern businesses.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-grade encryption, automated backups, and compliance with local data protection standards.",
      color: "from-teal-500 to-cyan-600",
    },
  ];

  const coreFeatures = [
    {
      icon: Receipt,
      title: "Smart Invoicing",
      desc: "AI-powered invoice generation",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      desc: "Live business insights",
    },
    {
      icon: Users,
      title: "Customer Management",
      desc: "Advanced CRM capabilities",
    },
  ];

  return (
    <section id="features" className="section-spacing bg-gray-50">
      <div className="page-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            Revolutionary Features
          </div>
          <h2 className="text-responsive-xl font-bold text-gray-900 mb-6">
            The Future of Business Management
            <br />
            <span className="text-gradient">Available Today</span>
          </h2>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
            Experience next-generation business tools designed specifically for
            Sri Lankan SMEs, powered by artificial intelligence and local market
            expertise.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full group cursor-pointer">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Core Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-soft border border-gray-200"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Complete Business Management Suite
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run and grow your business, enhanced with
              AI capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isIntersecting ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-100 transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Highlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-16 -translate-y-8">
              <div className="w-32 h-32 bg-white/10 rounded-full"></div>
            </div>
            <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-8">
              <div className="w-24 h-24 bg-white/10 rounded-full"></div>
            </div>
            <div className="relative z-10">
              <Brain className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h3 className="text-3xl font-bold mb-4">
                AI That Understands Sri Lankan Business
              </h3>
              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
                Our AI is trained on local market patterns, seasonal trends, and
                Sri Lankan business practices to provide insights that actually
                matter to your success.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Sinhala & Tamil Language Support
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Local Holiday & Festival Awareness
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Sri Lankan Tax Compliance
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
