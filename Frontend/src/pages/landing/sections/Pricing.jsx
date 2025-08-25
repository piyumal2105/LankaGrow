import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { Link } from "react-router-dom";

const Pricing = () => {
  const { ref, isIntersecting } = useIntersectionObserver();
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Smart Start",
      icon: Zap,
      price: { monthly: 750, yearly: 7500 },
      description: "Perfect for growing businesses ready to embrace AI",
      features: [
        "All basic business features",
        "AI-powered sales forecasting",
        "Smart inventory suggestions",
        "Automated expense categorization",
        "Mobile app with voice commands",
        "WhatsApp integration",
        "Email support",
      ],
      highlighted: false,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Business Pro",
      icon: Star,
      price: { monthly: 2000, yearly: 20000 },
      description: "Advanced AI features for serious entrepreneurs",
      features: [
        "Everything in Smart Start",
        "Advanced competitor tracking",
        "Customer behavior analytics",
        "Predictive cash flow analysis",
        "Multi-location support",
        "Advanced reporting",
        "Priority support",
        "API access",
      ],
      highlighted: true,
      color: "from-primary-500 to-purple-600",
    },
    {
      name: "Growth Master",
      icon: Crown,
      price: { monthly: 4000, yearly: 40000 },
      description: "Enterprise-grade AI for market leaders",
      features: [
        "Everything in Business Pro",
        "Custom AI models",
        "Advanced market intelligence",
        "White-label options",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 phone support",
        "Business consulting",
      ],
      highlighted: false,
      color: "from-accent-500 to-orange-600",
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="pricing" className="section-spacing bg-white">
      <div className="page-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-6">
            <Star className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-responsive-xl font-bold text-gray-900 mb-6">
            Choose Your AI-Powered
            <br />
            <span className="text-gradient">Growth Plan</span>
          </h2>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Start your AI journey with a plan that grows with your business. All
            plans include core features plus advanced AI capabilities.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-soft"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-900 shadow-soft"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-success-100 text-success-600 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <Card
                className={`h-full relative overflow-hidden ${
                  plan.highlighted
                    ? "ring-2 ring-primary-500 shadow-colored"
                    : ""
                }`}
              >
                <div className="relative z-10">
                  {/* Plan Header */}
                  <div className="mb-8">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} p-3 mb-4`}
                    >
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      <span className="text-gray-500">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && (
                      <p className="text-sm text-success-600 mt-1">
                        Save{" "}
                        {formatPrice(
                          plan.price.monthly * 12 - plan.price.yearly
                        )}{" "}
                        per year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 w-5 h-5 bg-success-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="h-3 w-3 text-success-600" />
                          </div>
                          <span className="text-gray-600 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link to="/register" className="block">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>

                {/* Background decoration */}
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-10">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full"></div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success-500" />
                30-day free trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success-500" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success-500" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success-500" />
                Data migration help
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
