import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Gift } from "lucide-react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-300 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main CTA content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Gift badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
            <Gift className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-semibold">
              30-Day Free Trial • No Credit Card Required
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block text-gradient bg-gradient-to-r from-yellow-300 to-blue-300 bg-clip-text text-transparent">
              Business with AI?
            </span>
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of Sri Lankan businesses already using AI to grow
            faster, make smarter decisions, and stay ahead of the competition.
          </p>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              "Setup in under 5 minutes",
              "Full AI features included",
              "Local Sri Lankan support",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-3"
              >
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-white font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              to="/register"
              className="group bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="group bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-3">
              <span>Schedule Demo</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/20"
        >
          <p className="text-blue-200 text-sm mb-4">
            Trusted by 500+ Sri Lankan businesses
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Add partner logos here */}
            <div className="text-white/40 text-sm">Bank of Ceylon</div>
            <div className="text-white/40 text-sm">People's Bank</div>
            <div className="text-white/40 text-sm">Commercial Bank</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
