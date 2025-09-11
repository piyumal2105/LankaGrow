import React from "react";
import { Link } from "react-router-dom";
import { Brain, ArrowLeft } from "lucide-react";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Back to home */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">
              LankaGrow
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
