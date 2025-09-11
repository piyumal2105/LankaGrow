import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

function Testimonials() {
  const testimonials = [
    {
      name: "Priya Wickramasinghe",
      business: "Wickrama Electronics",
      location: "Colombo",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "LankaGrow's AI predictions helped us increase sales by 18% in just 3 months. The inventory management is incredible - it tells us exactly when to reorder!",
      highlight: "18% sales increase",
    },
    {
      name: "Mohamed Fasil",
      business: "Fasil Trading",
      location: "Kandy",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "The voice commands in Tamil are amazing! I can update inventory while serving customers. The AI expense categorization saves me hours every week.",
      highlight: "Hours saved weekly",
    },
    {
      name: "Sanjaya Perera",
      business: "Perera & Sons",
      location: "Galle",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "Finally, a business platform built for Sri Lanka! The local market insights and automatic VAT calculations are exactly what we needed.",
      highlight: "Perfect for Sri Lanka",
    },
    {
      name: "Thilini Ranatunge",
      business: "Ranatunge Textiles",
      location: "Matara",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "The customer behavior AI identified our best customers and suggested targeted campaigns. Our customer retention improved by 25%!",
      highlight: "25% better retention",
    },
    {
      name: "Ravi Kumar",
      business: "Kumar Hardware",
      location: "Jaffna",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "LankaGrow's cash flow predictions helped us secure a bank loan. The reports are professional and the AI insights are spot-on.",
      highlight: "Secured bank loan",
    },
    {
      name: "Chamari Silva",
      business: "Silva Bakery",
      location: "Negombo",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "The seasonal trend analysis is magical! It predicted the Avurudu rush perfectly, and we were prepared with extra stock. Revenue up 30%!",
      highlight: "30% revenue boost",
    },
  ];

  return (
    <section className="py-24 bg-white">
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
            Trusted by Sri Lankan
            <span className="text-gradient bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Business Leaders
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            See how AI-powered business management is transforming SMEs across
            Sri Lanka
          </motion.p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-100 relative overflow-hidden h-full">
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-200 opacity-50" />

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Highlight badge */}
                <div className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full mb-4">
                  {testimonial.highlight}
                </div>

                {/* Testimonial text */}
                <blockquote className="text-gray-700 leading-relaxed mb-6 relative z-10">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.business}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Businesses Growing</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">15%</div>
            <div className="text-gray-600">Average Revenue Increase</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">8hrs</div>
            <div className="text-gray-600">Time Saved Per Week</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
