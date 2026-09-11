import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 animate-pulse flex flex-col h-full">
    <div className="aspect-[2/3] w-full bg-slate-800/60" />
    <div className="p-3.5 space-y-2">
      <div className="h-4 bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-800/60 rounded w-1/2" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 10 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 my-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const DetailsSkeleton = () => (
  <div className="max-w-5xl mx-auto py-8 animate-pulse space-y-8">
    <div className="h-80 sm:h-96 rounded-2xl bg-slate-800/60 w-full" />
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-48 h-72 rounded-xl bg-slate-800/80 shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="h-8 bg-slate-800 rounded w-2/3" />
        <div className="h-4 bg-slate-800/60 rounded w-1/3" />
        <div className="h-20 bg-slate-800/40 rounded w-full" />
      </div>
    </div>
  </div>
);

export default GridSkeleton;
