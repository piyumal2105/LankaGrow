import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Card from "../../../components/ui/Card";
import { useForm } from "../../../hooks/useForm";
import { useNotification } from "../../../context/NotificationContext";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { required, email } from "../../../utils/validation";

const Contact = () => {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { showSuccess, showError } = useNotification();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useForm(
    {
      name: "",
      email: "",
      company: "",
      message: "",
    },
    {
      name: [required],
      email: [required, email],
      message: [required],
    }
  );

  const onSubmit = async (formData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess("Thank you! We'll get back to you within 24 hours.");
      // Reset form would go here
    } catch (error) {
      showError("Something went wrong. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@lankagrow.lk",
      description: "We respond within 24 hours",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+94 11 234 5678",
      description: "Mon-Fri 9AM-6PM",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Colombo 03, Sri Lanka",
      description: "World Trade Center",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <section id="contact" className="section-spacing bg-white">
      <div className="page-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-100 text-success-700 rounded-full text-sm font-semibold mb-6">
            <MessageCircle className="h-4 w-4" />
            Get in Touch
          </div>
          <h2 className="text-responsive-xl font-bold text-gray-900 mb-6">
            Ready to Transform Your
            <br />
            <span className="text-gradient">Business with AI?</span>
          </h2>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto">
            Start your AI-powered business journey today. Our team of experts is
            here to help you every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isIntersecting ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gray-50 border-0 shadow-soft">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </h3>
                <p className="text-gray-600">
                  Tell us about your business and how we can help you grow with
                  AI.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    label="Full Name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                  />
                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="your@email.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                  />
                </div>

                <Input
                  name="company"
                  label="Company Name"
                  placeholder="Your business name"
                  value={values.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.company}
                />

                <Textarea
                  name="message"
                  label="Message"
                  placeholder="Tell us about your business needs..."
                  rows={5}
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.message}
                />

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full group"
                  size="lg"
                >
                  Send Message
                  <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isIntersecting ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Get in touch with our team
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Have questions about LankaGrow? Want to see a demo? Our team of
                business experts and AI specialists are here to help you
                understand how our platform can transform your business.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.color} p-3 flex-shrink-0`}
                    >
                      <contact.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {contact.title}
                      </h4>
                      <p className="text-primary-600 font-semibold mb-1">
                        {contact.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary-600" />
                <h4 className="font-bold text-gray-900">Quick Response Time</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                We're committed to helping Sri Lankan businesses succeed. Our
                support team responds to all inquiries within 24 hours, and our
                AI specialists are available for consultations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
