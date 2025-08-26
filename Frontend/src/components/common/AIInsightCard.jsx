import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

const AIInsightCard = ({ insight, className = "" }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case "prediction":
        return TrendingUp;
      case "warning":
        return AlertCircle;
      case "recommendation":
        return Lightbulb;
      default:
        return Brain;
    }
  };

  const getInsightColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "primary";
    }
  };

  const Icon = getInsightIcon(insight.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="relative overflow-hidden group cursor-pointer">
        {/* AI Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-accent-500/5 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-primary-200 group-hover:to-primary-100 transition-colors">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getInsightColor(insight.priority)}>
                  {insight.priority} priority
                </Badge>
                <span className="text-xs text-gray-500">
                  {insight.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {insight.title}
              </h3>
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-600 leading-relaxed mb-4">
            {insight.description}
          </p>

          {/* Metrics */}
          {insight.metrics && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {insight.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-500">{metric.label}</div>
                  <div className="font-bold text-gray-900">{metric.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action */}
          {insight.action && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">{insight.action}</span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </div>
          )}

          {/* AI Badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-medium rounded-full">
              <Brain className="h-3 w-3" />
              AI
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIInsightCard;
