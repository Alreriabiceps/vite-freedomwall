import { motion } from "framer-motion";

// Enhanced Card with hover effects
export const InteractiveCard = ({
  children,
  onClick,
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
