import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Brain, TrendingUp, Zap } from "lucide-react";
import Button from "../../../components/ui/Button";

const Hero = () => {
  const floatingIcons = [
    { Icon: Brain, delay: 0, position: "top-20 left-10" },
    { Icon: TrendingUp, delay: 0.5, position: "top-32 right-16" },
    { Icon: Sparkles, delay: 1, position: "bottom-32 left-16" },
    { Icon: Zap, delay: 1.5, position: "bottom-20 right-10" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-animated opacity-10"></div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingIcons.map(({ Icon, delay, position }, index) => (
          <motion.div
            key={index}
            className={`absolute ${position} text-primary-200`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              delay,
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="h-16 w-16" />
          </motion.div>
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY5ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzRoLTJ2LTJoMnYyem0wLTEwaC0ydi0yaDJ2MnptMC0xMGgtMnYtMmgyek0yNiAzNGgtMnYtMmgyek0yNiAyNGgtMnYtMmgyek0yNiAxNGgtMnYtMmgyek0xNiAzNGgtMnYtMmgyek0xNiAyNGgtMnYtMmgyek0xNiAxNGgtMnYtMmgyek02IDM0aC0ydi0yaDJ2MnptMC0xMGgtMnYtMmgyek02IDE0aC0ydi0yaDJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div className="relative z-10 page-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold mb-8 shadow-soft"
          >
            <Sparkles className="h-4 w-4" />
            Sri Lanka's First AI-Powered Business Platform
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-responsive-2xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Where Sri Lankan Business
            <br />
            <span className="text-gradient">Meets Artificial Intelligence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-responsive-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your small business with predictive analytics, automated
            workflows, and local market insights. The first platform that thinks
            ahead for you.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              AI-Powered Insights
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              Local Market Intelligence
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              Automated Workflows
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/register">
              <Button size="lg" className="group">
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="ghost" size="lg">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-6">
              Trusted by 1,500+ Sri Lankan businesses
            </p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">Retail+</div>
              <div className="text-2xl font-bold text-gray-400">SME.lk</div>
              <div className="text-2xl font-bold text-gray-400">CeylonBiz</div>
              <div className="text-2xl font-bold text-gray-400">LocalTrade</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.4, duration: 1, ease: "easeOut" }}
          className="mt-20 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 blur-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl shadow-large border border-gray-200 p-8 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  <div className="h-20 bg-gradient-to-br from-accent-100 to-accent-50 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="h-20 bg-gradient-to-br from-success-100 to-success-50 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
