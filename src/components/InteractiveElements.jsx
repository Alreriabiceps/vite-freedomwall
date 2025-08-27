import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageSquare,
  Flag,
  ThumbsUp,
  Eye,
  EyeOff,
} from "lucide-react";

// Enhanced Button with multiple interaction states
export const InteractiveButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon = null,
  className = "",
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses =
    "relative overflow-hidden font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2 rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl",
    xl: "px-8 py-4 text-xl rounded-xl",
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit"
          >
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          scale: isPressed ? 0.95 : 1,
          y: isPressed ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
        className="flex items-center justify-center gap-2"
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className={loading ? "opacity-0" : "opacity-100"}>
          {children}
        </span>
      </motion.div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0 rounded-inherit"
        animate={{
          scale: isPressed ? 1.5 : 0,
          opacity: isPressed ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// Enhanced Card with hover effects
export const InteractiveCard = ({
  children,
  onClick,
  hoverable = false,
  className = "",
  ...props
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Like Button with heart animation
export const AnimatedLikeButton = ({
  isLiked,
  onClick,
  size = "md",
  className = "",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      onClick();
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative ${
        sizes[size]
      } flex items-center justify-center rounded-full transition-colors ${
        isLiked
          ? "text-red-500 bg-red-50"
          : "text-gray-400 hover:text-red-400 hover:bg-red-50"
      } ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isLiked ? (
          <motion.div
            key="liked"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Heart
              size={size === "sm" ? 16 : size === "md" ? 20 : 24}
              className="fill-current"
            />
          </motion.div>
        ) : (
          <motion.div
            key="not-liked"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart burst effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Heart
            size={size === "sm" ? 16 : size === "md" ? 20 : 24}
            className="text-red-500 fill-current"
          />
        </motion.div>
      )}
    </motion.button>
  );
};

// Enhanced Comment Button
export const AnimatedCommentButton = ({
  onClick,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative ${sizes[size]} flex items-center justify-center rounded-full text-blue-500 hover:bg-blue-50 transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageSquare size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
    </motion.button>
  );
};

// Enhanced Visibility Toggle
export const AnimatedVisibilityToggle = ({
  isVisible,
  onToggle,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <motion.button
      onClick={onToggle}
      className={`${sizes[size]} flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            key="visible"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Eye size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
          </motion.div>
        ) : (
          <motion.div
            key="hidden"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <EyeOff size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Enhanced Progress Bar with animation
export const AnimatedProgressBar = ({
  progress,
  color = "blue",
  height = "h-2",
  className = "",
  showLabel = false,
  animated = true,
}) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}

      <div
        className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}
      >
        <motion.div
          className={`${colors[color]} ${height} rounded-full`}
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { duration: 1, ease: "easeOut" } : {}}
        />
      </div>
    </div>
  );
};

// Enhanced Toggle Switch
export const AnimatedToggle = ({
  isOn,
  onToggle,
  disabled = false,
  className = "",
}) => {
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isOn
          ? "bg-blue-600 focus:ring-blue-500"
          : "bg-gray-300 focus:ring-gray-500"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ x: isOn ? 24 : 2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </motion.button>
  );
};
