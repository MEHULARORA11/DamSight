import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} style={style} />;
}

export function DamListSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`skel-dam-${i}`} className="p-3 rounded-md bg-muted/30">
          <div className="flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-md shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
              <Skeleton className="h-2 w-2/3" />
            </div>
            <Skeleton className="h-4 w-14 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4 space-y-2">
      <Skeleton className="h-2.5 w-24" />
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-2 w-20" />
    </div>
  );
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return <Skeleton className={`w-full rounded-md`} style={{ height: `${height}px` }} />;
}
