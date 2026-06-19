import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  className = '',
  width,
  height,
}) => {
  const getShapeClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded h-3.5 my-1.5 w-full';
      case 'rectangular':
      default:
        return 'rounded-xl';
    }
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      style={style}
      className={`shimmer shimmer-bg border border-white/5 opacity-80 ${getShapeClass()} ${className}`}
      aria-hidden="true"
    />
  );
};
