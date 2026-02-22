import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import Trash2 from 'lucide-react/dist/esm/icons/trash2';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle2';
import { cn } from '@/shared/lib/cn';

interface SwipeableItemProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  leftActionColor?: string;
  rightActionColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  threshold?: number;
}

export const SwipeableItem = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
  leftActionColor = 'bg-emerald-500',
  rightActionColor = 'bg-red-500',
  leftIcon = <CheckCircle2 className="text-white w-6 h-6" />,
  rightIcon = <Trash2 className="text-white w-6 h-6" />,
  threshold = 100
}: SwipeableItemProps) => {
  const x = useMotionValue(0);
  const [isPresent, setIsPresent] = useState(true);
  
  // Transform x to opacity for background indicators
  const leftOpacity = useTransform(x, [0, threshold], [0, 1]);
  const rightOpacity = useTransform(x, [0, -threshold], [0, 1]);
  
  // Transform x to scale for icons
  const leftScale = useTransform(x, [0, threshold], [0.5, 1.2]);
  const rightScale = useTransform(x, [0, -threshold], [0.5, 1.2]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (onSwipeRight && info.offset.x > threshold) {
      // Swiped Right (Complete)
      onSwipeRight();
      // Reset position if action doesn't remove item immediately
      // x.set(0); 
    } else if (onSwipeLeft && info.offset.x < -threshold) {
      // Swiped Left (Delete)
      onSwipeLeft();
    } else {
      // Reset
      // Animation handled by dragConstraints
    }
  };

  if (!isPresent) return null;

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Right Swipe Action Background (Left Side) */}
      {onSwipeRight && (
        <motion.div 
          style={{ opacity: leftOpacity }}
          className={cn("absolute inset-y-0 left-0 w-full flex items-center justify-start px-6", leftActionColor)}
        >
          <motion.div style={{ scale: leftScale }}>
            {leftIcon}
          </motion.div>
        </motion.div>
      )}

      {/* Left Swipe Action Background (Right Side) */}
      {onSwipeLeft && (
        <motion.div 
          style={{ opacity: rightOpacity }}
          className={cn("absolute inset-y-0 right-0 w-full flex items-center justify-end px-6", rightActionColor)}
        >
          <motion.div style={{ scale: rightScale }}>
            {rightIcon}
          </motion.div>
        </motion.div>
      )}

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1} // Resistance
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={cn("relative bg-surface touch-pan-y", className)}
        whileTap={{ cursor: "grabbing" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
