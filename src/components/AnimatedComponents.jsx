import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Smooth fade-in animation
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Staggered children animation
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className = "",
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Staggered item animation
export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Smooth scale animation for interactive elements
export const ScaleOnHover = ({ children, scale = 1.05, className = "" }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide-in animation from different directions
export const SlideIn = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className = "",
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 50, opacity: 0 };
      case "down":
        return { y: -50, opacity: 0 };
      case "left":
        return { x: 50, opacity: 0 };
      case "right":
        return { x: -50, opacity: 0 };
      default:
        return { y: 50, opacity: 0 };
    }
  };

  const getAnimatePosition = () => {
    switch (direction) {
      case "up":
        return { y: 0, opacity: 1 };
      case "down":
        return { y: 0, opacity: 1 };
      case "left":
        return { x: 0, opacity: 1 };
      case "right":
        return { x: 0, opacity: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={getAnimatePosition()}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating animation for subtle movement
export const Floating = ({ children, className = "" }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Pulse animation for attention
export const Pulse = ({ children, className = "" }) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated counter for numbers
export const AnimatedCounter = ({ value, duration = 1, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useState(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const currentValue = Math.floor(progress * value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};

// Animated loading spinner
export const AnimatedSpinner = ({ size = 24, className = "" }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={`w-${size} h-${size} border-2 border-gray-300 border-t-blue-600 rounded-full ${className}`}
  />
);

// Animated progress bar
export const AnimatedProgress = ({
  progress,
  duration = 1,
  className = "",
}) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <motion.div
      className="bg-blue-600 h-2 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration, ease: "easeOut" }}
    />
  </div>
);

// Animated list item with stagger
export const AnimatedListItem = ({ children, index, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      ease: "easeOut",
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated modal backdrop
export const AnimatedBackdrop = ({
  children,
  isOpen,
  onClose,
  className = "",
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Animated modal content
export const AnimatedModal = ({ children, isOpen, className = "" }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
