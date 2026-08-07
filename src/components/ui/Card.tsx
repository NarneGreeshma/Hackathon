import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  glow = false,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`relative overflow-hidden rounded-xl border border-gray-800/80 bg-gray-900/60 p-6 backdrop-blur-md transition-all duration-300 ${
        glow ? 'shadow-[0_0_25px_rgba(59,130,246,0.12)] border-blue-500/30' : ''
      } ${
        hoverable ? 'hover:border-blue-500/40 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer' : ''
      } ${className}`}
    >
      <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
