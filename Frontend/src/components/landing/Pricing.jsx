import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Rocket } from "lucide-react";

function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Smart Start",
      icon: Sparkles,
      description: "Perfect for small businesses getting started with AI",
      monthlyPrice: 750,
      annualPrice: 7500,
      popular: false,
      features: [
        "All basic business features",
        "AI sales forecasting",
        "Smart expense categorization",
        "Mobile app with voice commands",
        "Email support",
        "Up to 500 products",
        "Up to 100 customers",
        "Basic reporting",
      ],
      aiFeatures: ["Sales predictions", "Basic automation", "Simple insights"],
    },
    {
      name: "Business Pro",
      icon: Crown,
      description: "Most popular plan with full AI capabilities",
      monthlyPrice: 2000,
      annualPrice: 20000,
      popular: true,
      features: [
        "Everything in Smart Start",
        "Full AI suite",
        "Competitor price tracking",
        "Advanced automation",
        "WhatsApp integration",
        "Priority support",
        "Unlimited products",
        "Unlimited customers",
        "Advanced analytics",
        "Custom reports",
      ],
      aiFeatures: [
        "Market intelligence",
        "Customer behavior AI",
        "Growth recommendations",
        "Inventory optimization",
      ],
    },
    {
      name: "Growth Master",
      icon: Rocket,
      description: "Enterprise-grade with custom AI models",
      monthlyPrice: 4000,
      annualPrice: 40000,
      popular: false,
      features: [
        "Everything in Business Pro",
        "Custom AI models",
        "Advanced market analysis",
        "Business networking",
        "Banking integrations",
        "Dedicated support",
        "Multi-location support",
        "API access",
        "White-label options",
        "Custom integrations",
      ],
      aiFeatures: [
        "Personalized AI assistant",
        "Predictive scaling",
        "Market opportunity scanner",
        "Custom automation",
      ],
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
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
          >
            Choose Your
            <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              AI Journey
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Start with traditional features and scale up to full AI capabilities
            as your business grows
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-4"
          >
            <span
              className={`text-sm ${
                !isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                isAnnual ? "text-gray-900 font-semibold" : "text-gray-500"
              }`}
            >
              Annual
            </span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Save 17%
            </span>
          </motion.div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl ${
                plan.popular
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-105"
                  : "bg-white text-gray-900"
              } shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan header */}
                <div className="text-center mb-8">
                  <plan.icon
                    className={`w-12 h-12 mx-auto mb-4 ${
                      plan.popular ? "text-yellow-300" : "text-blue-600"
                    }`}
                  />
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p
                    className={`text-sm ${
                      plan.popular ? "text-blue-100" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm">LKR</span>
                    <span className="text-4xl font-bold">
                      {new Intl.NumberFormat("en-LK").format(
                        isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice
                      )}
                    </span>
                    <span className="text-sm">/month</span>
                  </div>
                  {isAnnual && (
                    <p
                      className={`text-sm mt-2 ${
                        plan.popular ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      Billed annually (LKR{" "}
                      {new Intl.NumberFormat("en-LK").format(plan.annualPrice)})
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4
                    className={`font-semibold ${
                      plan.popular ? "text-blue-100" : "text-gray-700"
                    }`}
                  >
                    Core Features:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check
                          className={`w-5 h-5 ${
                            plan.popular ? "text-green-300" : "text-green-500"
                          } mr-3 mt-0.5 flex-shrink-0`}
                        />
                        <span
                          className={`text-sm ${
                            plan.popular ? "text-blue-50" : "text-gray-600"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <h4
                    className={`font-semibold mt-6 ${
                      plan.popular ? "text-yellow-300" : "text-blue-600"
                    }`}
                  >
                    AI Features:
                  </h4>
                  <ul className="space-y-3">
                    {plan.aiFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Sparkles
                          className={`w-5 h-5 ${
                            plan.popular ? "text-yellow-300" : "text-blue-500"
                          } mr-3 mt-0.5 flex-shrink-0`}
                        />
                        <span
                          className={`text-sm ${
                            plan.popular ? "text-blue-50" : "text-gray-600"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    plan.popular
                      ? "bg-white text-blue-600 hover:bg-gray-100"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.popular ? "Start Free Trial" : "Get Started"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            All plans include 30-day free trial • No setup fees • Cancel anytime
          </p>
          <p className="text-sm text-gray-500">
            Need a custom plan?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default Pricing;
