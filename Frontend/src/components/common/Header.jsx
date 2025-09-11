import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Brain, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "AI Capabilities", href: "#ai-features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  const isLandingPage = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLandingPage
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50"
          : "bg-white shadow-sm border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gray-900">
                LankaGrow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isLandingPage &&
              navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}

            {/* Solutions dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Retail & E-commerce
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Manufacturing
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Services & Consulting
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Food & Beverage
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link to="/register" className="btn-primary rounded-lg">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {isLandingPage &&
              navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            <Link
              to="/login"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 bg-blue-600 text-white rounded-md font-medium text-center"
              onClick={() => setIsOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}

export default Header;
