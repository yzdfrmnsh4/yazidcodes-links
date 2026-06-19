import React, { useState } from 'react';
import { Skeleton } from './Skeleton';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonVariant?: 'circular' | 'rectangular';
  skeletonClassName?: string;
  containerClassName?: string;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  skeletonVariant = 'rectangular',
  skeletonClassName = '',
  containerClassName = '',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div className={`relative overflow-hidden w-full h-full ${containerClassName}`}>
      {/* Skeleton display */}
      {(!isLoaded || hasError) && (
        <Skeleton
          variant={skeletonVariant}
          className={`absolute inset-0 w-full h-full z-10 ${skeletonClassName}`}
        />
      )}

      {/* Image display */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
          } ${className}`}
          {...props}
        />
      )}

      {/* Error state display (optional fallback icon/box if image fails) */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-slate-400 text-[10px] border border-white/5 rounded-xl">
          Failed to load image
        </div>
      )}
    </div>
  );
};
