import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Card from "../../../components/ui/Card";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";

const Testimonials = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  const testimonials = [
    {
      name: "Priya Perera",
      title: "Owner, Ceylon Spices",
      location: "Colombo",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      content:
        "LankaGrow's AI predictions helped us reduce inventory waste by 40% and increase profits by 25%. The local market insights are incredibly accurate.",
      rating: 5,
      business: "Spice Trading",
    },
    {
      name: "Rohan Silva",
      title: "Founder, TechFix Solutions",
      location: "Kandy",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      content:
        "The automated invoicing and AI-powered customer insights transformed our service business. We're serving 300% more customers efficiently.",
      rating: 5,
      business: "Electronics Repair",
    },
    {
      name: "Sanduni Wickramasinghe",
      title: "Manager, Green Garden Cafe",
      location: "Galle",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      content:
        "The seasonal predictions for festivals and holidays helped us prepare better. Revenue increased 60% during Sinhala New Year thanks to LankaGrow.",
      rating: 5,
      business: "Restaurant",
    },
    {
      name: "Mahinda Rajapaksa",
      title: "Director, Lanka Fashion House",
      location: "Negombo",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
      content:
        "From manual records to AI-powered insights - what a journey! Our fashion business is now data-driven and more profitable than ever.",
      rating: 5,
      business: "Fashion Retail",
    },
  ];

  const stats = [
    { number: "1,500+", label: "Active Businesses" },
    { number: "40%", label: "Average Cost Reduction" },
    { number: "85%", label: "Forecast Accuracy" },
    { number: "24/7", label: "AI Support" },
  ];

  return (
    <section
      id="testimonials"
      className="section-spacing bg-gradient-to-br from-primary-50 to-accent-50"
    >
      <div className="page-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-primary-700 rounded-full text-sm font-semibold mb-6">
            <Quote className="h-4 w-4" />
            Success Stories
          </div>
          <h2 className="text-responsive-xl font-bold text-gray-900 mb-6">
            Trusted by Sri Lankan
            <br />
            <span className="text-gradient">Business Leaders</span>
          </h2>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful Sri Lankan entrepreneurs who've
            transformed their businesses with AI-powered insights and
            automation.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-white/20 shadow-soft hover:shadow-medium transition-all duration-300">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.title}
                    </div>
                    <div className="text-sm text-primary-600">
                      {testimonial.business} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
