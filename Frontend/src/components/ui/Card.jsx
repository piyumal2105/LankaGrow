import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const Card = React.forwardRef(
  ({ className, children, hover = false, ...props }, ref) => {
    const CardComponent = hover ? motion.div : "div";

    return (
      <CardComponent
        ref={ref}
        className={cn(
          "card",
          hover && "hover:shadow-medium hover:-translate-y-1 cursor-pointer",
          className
        )}
        {...(hover && {
          whileHover: { y: -4, transition: { duration: 0.2 } },
          whileTap: { y: -2 },
        })}
        {...props}
      >
        {children}
      </CardComponent>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div
    className={cn("mt-4 pt-4 border-t border-gray-200", className)}
    {...props}
  >
    {children}
  </div>
);

export default Card;
