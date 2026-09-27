import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-stone-200/80 rounded-lg ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200/70 p-3">
      <Skeleton className="w-full aspect-4/5 rounded-xl mb-4" />
      <div className="space-y-2 px-1 pb-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="pt-2 flex justify-between items-center">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
